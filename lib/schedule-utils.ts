import pool from './db';
import { CascadeStatus, TotoModel } from './types';

// Day name mapping
const dayNameToNumber: Record<string, number> = {
    'sunday': 0,
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5,
    'saturday': 6,
};

interface ScheduleRow {
    game_type: '4D' | 'Toto' | 'Sweep';
    draw_days: string;
    draw_time: string;
    cascade_draw_time: string | null;
    special_rule: string | null;
}

/**
 * Get schedule from database for a specific game
 */
export async function getSchedule(gameType: '4D' | 'Toto' | 'Sweep'): Promise<ScheduleRow | null> {
    try {
        const [rows]: any = await pool.query(
            'SELECT game_type, draw_days, draw_time, cascade_draw_time, special_rule FROM schedules WHERE game_type = ?',
            [gameType]
        );
        return rows.length > 0 ? rows[0] : null;
    } catch (e) {
        console.error('Error fetching schedule:', e);
        return null;
    }
}

/**
 * Get TOTO cascade status from database
 */
export async function getTotoCascadeStatus(): Promise<CascadeStatus | null> {
    try {
        const [rows]: any = await pool.query(
            'SELECT consecutive_no_winner, is_cascade_draw, last_checked_draw_no, updated_at FROM toto_cascade_status LIMIT 1'
        );
        if (rows.length === 0) return null;
        return {
            consecutiveNoWinner: rows[0].consecutive_no_winner,
            isCascadeDraw: rows[0].is_cascade_draw === 1,
            lastCheckedDrawNo: rows[0].last_checked_draw_no,
            updatedAt: rows[0].updated_at
        };
    } catch (e) {
        console.error('Error fetching cascade status:', e);
        return null;
    }
}

/**
 * Update TOTO cascade status based on latest draw result
 */
export async function updateTotoCascadeStatus(latestResult: TotoModel): Promise<CascadeStatus> {
    const connection = await pool.getConnection();
    try {
        // Check if Group 1 had any winners
        const group1 = latestResult.winningShares?.find(s => s.group.includes('Group 1'));
        const hasGroup1Winner = group1 && group1.count > 0;

        // Get current status
        const [rows]: any = await connection.query(
            'SELECT consecutive_no_winner, last_checked_draw_no FROM toto_cascade_status LIMIT 1'
        );

        let consecutiveNoWinner = 0;

        if (rows.length > 0) {
            // Check if we've already processed this draw
            if (rows[0].last_checked_draw_no === latestResult.drawNo) {
                // Already processed, return current status
                const currentStatus = await getTotoCascadeStatus();
                connection.release();
                return currentStatus!;
            }

            consecutiveNoWinner = rows[0].consecutive_no_winner;
        }

        // Update counter
        if (hasGroup1Winner) {
            consecutiveNoWinner = 0; // Reset on win
        } else {
            consecutiveNoWinner += 1; // Increment on no win
        }

        // Cascade triggers after 3 consecutive no-winner draws
        const isCascadeDraw = consecutiveNoWinner >= 3;

        // Update or insert
        if (rows.length > 0) {
            await connection.query(
                'UPDATE toto_cascade_status SET consecutive_no_winner = ?, is_cascade_draw = ?, last_checked_draw_no = ?, updated_at = NOW()',
                [consecutiveNoWinner, isCascadeDraw, latestResult.drawNo]
            );
        } else {
            await connection.query(
                'INSERT INTO toto_cascade_status (consecutive_no_winner, is_cascade_draw, last_checked_draw_no) VALUES (?, ?, ?)',
                [consecutiveNoWinner, isCascadeDraw, latestResult.drawNo]
            );
        }

        connection.release();
        return {
            consecutiveNoWinner,
            isCascadeDraw,
            lastCheckedDrawNo: latestResult.drawNo,
            updatedAt: new Date()
        };
    } catch (e) {
        console.error('Error updating cascade status:', e);
        connection.release();
        throw e;
    }
}

/**
 * Get the effective draw time for TOTO (normal or cascade)
 */
export async function getTotoDrawTime(): Promise<{ drawTime: string; isCascade: boolean }> {
    const schedule = await getSchedule('Toto');
    const cascadeStatus = await getTotoCascadeStatus();

    if (!schedule) {
        return { drawTime: '18:30', isCascade: false };
    }

    if (cascadeStatus?.isCascadeDraw && schedule.cascade_draw_time) {
        return { drawTime: schedule.cascade_draw_time, isCascade: true };
    }

    return { drawTime: schedule.draw_time, isCascade: false };
}

/**
 * Recalculate cascade status from recent TOTO results
 * Useful for initialization or recovery
 */
export async function recalculateCascadeStatus(): Promise<CascadeStatus> {
    try {
        // Get last 3 TOTO results
        const [rows]: any = await pool.query(
            'SELECT data FROM results WHERE type = "Toto" ORDER BY draw_date DESC LIMIT 3'
        );

        let consecutiveNoWinner = 0;
        let lastDrawNo: number | null = null;

        // Process from oldest to newest (reverse the results)
        const results = rows.reverse();

        for (const row of results) {
            const data = JSON.parse(row.data) as TotoModel;
            if (!lastDrawNo) lastDrawNo = data.drawNo;

            const group1 = data.winningShares?.find(s => s.group.includes('Group 1'));
            const hasGroup1Winner = group1 && group1.count > 0;

            if (hasGroup1Winner) {
                consecutiveNoWinner = 0;
            } else {
                consecutiveNoWinner++;
            }

            lastDrawNo = data.drawNo;
        }

        const isCascadeDraw = consecutiveNoWinner >= 3;

        // Update database
        await pool.query(
            'UPDATE toto_cascade_status SET consecutive_no_winner = ?, is_cascade_draw = ?, last_checked_draw_no = ?, updated_at = NOW()',
            [consecutiveNoWinner, isCascadeDraw, lastDrawNo]
        );

        return {
            consecutiveNoWinner,
            isCascadeDraw,
            lastCheckedDrawNo: lastDrawNo,
            updatedAt: new Date()
        };
    } catch (e) {
        console.error('Error recalculating cascade status:', e);
        throw e;
    }
}

/**
 * Check if a given date is the first occurrence of a specific weekday in its month
 */
function isFirstWeekdayOfMonth(date: Date, weekday: number): boolean {
    const year = date.getFullYear();
    const month = date.getMonth();

    // Find first occurrence of this weekday in the month
    const firstOfMonth = new Date(year, month, 1);
    let firstWeekdayDate = 1;

    const firstDayOfWeek = firstOfMonth.getDay();
    if (firstDayOfWeek <= weekday) {
        firstWeekdayDate = 1 + (weekday - firstDayOfWeek);
    } else {
        firstWeekdayDate = 1 + (7 - firstDayOfWeek + weekday);
    }

    return date.getDate() === firstWeekdayDate;
}

/**
 * Check if a given date is a draw day for the specified game
 */
export function isDrawDay(date: Date, schedule: ScheduleRow): boolean {
    const dayOfWeek = date.getDay();
    const drawDays = schedule.draw_days.toLowerCase().split(',').map(d => d.trim());

    // Check if current day is in draw days
    const dayMatches = drawDays.some(dayName => dayNameToNumber[dayName] === dayOfWeek);

    if (!dayMatches) return false;

    // Handle special rules
    if (schedule.special_rule === 'first_wednesday_of_month') {
        return isFirstWeekdayOfMonth(date, 3); // 3 = Wednesday
    }

    return true;
}

/**
 * Get the most recent draw date for a game (including today if it's a draw day)
 */
export function getMostRecentDrawDate(schedule: ScheduleRow, currentDate: Date = new Date()): Date {
    // Create a copy to avoid mutating
    const date = new Date(currentDate);
    date.setHours(0, 0, 0, 0);

    // Check up to 31 days back to find the most recent draw
    for (let i = 0; i < 31; i++) {
        const checkDate = new Date(date);
        checkDate.setDate(checkDate.getDate() - i);

        if (isDrawDay(checkDate, schedule)) {
            return checkDate;
        }
    }

    // Fallback to current date if no draw found
    return date;
}

/**
 * Get the next draw date for a game
 */
export function getNextDrawDate(schedule: ScheduleRow, currentDate: Date = new Date()): Date {
    const date = new Date(currentDate);
    date.setHours(0, 0, 0, 0);

    // Check today first, then look forward
    for (let i = 0; i < 31; i++) {
        const checkDate = new Date(date);
        checkDate.setDate(checkDate.getDate() + i);

        if (isDrawDay(checkDate, schedule)) {
            return checkDate;
        }
    }

    return date;
}

/**
 * Format date for display in titles
 */
export function formatTitleDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Check if results exist for a specific date
 */
export async function hasResultsForDate(gameType: '4D' | 'Toto' | 'Sweep', date: Date): Promise<boolean> {
    try {
        const dateStr = date.toISOString().split('T')[0];
        const [rows]: any = await pool.query(
            'SELECT id FROM results WHERE type = ? AND draw_date = ?',
            [gameType, dateStr]
        );
        return rows.length > 0;
    } catch (e) {
        console.error('Error checking results:', e);
        return false;
    }
}

/**
 * Get the title for a game page with dynamic date
 */
export async function getGamePageTitle(gameType: '4D' | 'Toto' | 'Sweep'): Promise<string> {
    const schedule = await getSchedule(gameType);
    if (!schedule) {
        return `${gameType} Results`;
    }

    const currentDate = new Date();
    const mostRecentDrawDate = getMostRecentDrawDate(schedule, currentDate);
    const formattedDate = formatTitleDate(mostRecentDrawDate);

    const gameName = gameType === 'Sweep' ? 'Singapore Sweep' : gameType;

    return `${gameName} Result Today - ${formattedDate} | Singapore Draw`;
}

/**
 * Check if it's a draw day and results haven't been scraped yet
 */
export async function shouldShowPlaceholder(gameType: '4D' | 'Toto' | 'Sweep'): Promise<boolean> {
    const schedule = await getSchedule(gameType);
    if (!schedule) return false;

    const currentDate = new Date();

    // Check if today is a draw day
    if (!isDrawDay(currentDate, schedule)) {
        return false;
    }

    // Check if we have results for today
    const hasResults = await hasResultsForDate(gameType, currentDate);

    return !hasResults;
}
