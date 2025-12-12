import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import puppeteer from 'puppeteer';
import { log } from '@/lib/logger';
import { purgeGameCache } from '@/lib/cloudflare';
import { FourDModel, TotoModel, SweepModel } from '@/lib/types';
import { updateTotoCascadeStatus } from '@/lib/schedule-utils';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

// Config for retry logic
const RETRY_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_RETRY_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours
const MAX_RETRIES = Math.floor(MAX_RETRY_DURATION_MS / RETRY_INTERVAL_MS); // 96 retries

type GameType = '4D' | 'Toto' | 'Sweep';

interface ScheduleRow {
    game_type: GameType;
    draw_days: string;
    draw_time: string;
    special_rule: string | null;
}

// Get today in Singapore timezone
function getSGTDate(): Date {
    const now = new Date();
    // Convert to SGT
    return new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Singapore' }));
}

// Get schedule from database
async function getSchedule(gameType: GameType): Promise<ScheduleRow | null> {
    try {
        const [rows]: any = await pool.query(
            'SELECT game_type, draw_days, draw_time, special_rule FROM schedules WHERE game_type = ?',
            [gameType]
        );
        if (rows.length === 0) return null;
        return rows[0] as ScheduleRow;
    } catch (e: any) {
        log(`[Cron] Error fetching schedule for ${gameType}: ${e.message}`, 'ERROR');
        return null;
    }
}

// Check if today is a draw day for the game
function isDrawDay(schedule: ScheduleRow): boolean {
    const sgtDate = getSGTDate();
    const dayOfWeek = sgtDate.toLocaleDateString('en-US', { weekday: 'long' });
    const drawDays = schedule.draw_days.split(',').map(d => d.trim().toLowerCase());

    // Special handling for Sweep (first Wednesday of month)
    if (schedule.special_rule === 'first_wednesday_of_month') {
        if (dayOfWeek.toLowerCase() !== 'wednesday') return false;
        // Check if this is the first Wednesday
        const dayOfMonth = sgtDate.getDate();
        return dayOfMonth <= 7;
    }

    return drawDays.includes(dayOfWeek.toLowerCase());
}

// Check if result already exists for today
async function resultExistsForToday(gameType: GameType): Promise<boolean> {
    const sgtDate = getSGTDate();
    const today = `${sgtDate.getFullYear()}-${String(sgtDate.getMonth() + 1).padStart(2, '0')}-${String(sgtDate.getDate()).padStart(2, '0')}`;

    try {
        const [rows]: any = await pool.query(
            'SELECT id FROM results WHERE type = ? AND draw_date = ?',
            [gameType, today]
        );
        return rows.length > 0;
    } catch (e) {
        return false;
    }
}

// Scrape single game - returns result data or null if not available
async function scrapeGame(gameType: GameType): Promise<FourDModel | TotoModel | SweepModel | null> {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent(USER_AGENT);

        let url: string;
        switch (gameType) {
            case '4D':
                url = 'http://www.singaporepools.com.sg/en/product/Pages/4d_results.aspx';
                break;
            case 'Toto':
                url = 'http://www.singaporepools.com.sg/en/product/Pages/toto_results.aspx';
                break;
            case 'Sweep':
                url = 'http://www.singaporepools.com.sg/en/product/Pages/sweep_results.aspx';
                break;
        }

        log(`[Cron] Scraping ${gameType} from ${url}`, 'INFO');
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

        // Extract the latest result
        let result: any = null;

        if (gameType === '4D') {
            result = await page.evaluate(() => {
                const item = document.querySelector('.tables-wrap');
                if (!item) return null;

                const drawNoText = item.querySelector('.drawNumber')?.textContent?.trim() || '';
                const drawNo = Number(drawNoText.split(' ')[2]);
                const rawDrawDate = item.querySelector('.drawDate')?.textContent?.trim() || '';
                const dateObj = new Date(`${rawDrawDate} GMT+0800`);
                const drawDate = dateObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Singapore' });

                const winning = [
                    Number(item.querySelector('.tdFirstPrize')?.textContent?.trim()),
                    Number(item.querySelector('.tdSecondPrize')?.textContent?.trim()),
                    Number(item.querySelector('.tdThirdPrize')?.textContent?.trim()),
                ];

                const starter = Array.from(item.querySelectorAll('.tbodyStarterPrizes td')).map(td => Number(td.textContent));
                const consolation = Array.from(item.querySelectorAll('.tbodyConsolationPrizes td')).map(td => Number(td.textContent));

                return { drawNo, drawDate, winning, starter, consolation };
            });
        } else if (gameType === 'Toto') {
            result = await page.evaluate(() => {
                const item = document.querySelector('.tables-wrap');
                if (!item) return null;

                const drawNoText = item.querySelector('.drawNumber')?.textContent?.trim() || '';
                const drawNo = Number(drawNoText.split(' ')[2]);
                const rawDrawDate = item.querySelector('.drawDate')?.textContent?.trim() || '';
                const cleanDate = rawDrawDate.replace(/\s+/g, ' ').trim();
                const dateObj = new Date(`${cleanDate} GMT+0800`);
                const drawDate = dateObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Singapore' });

                const winning = [
                    Number(item.querySelector('.win1')?.textContent?.trim()),
                    Number(item.querySelector('.win2')?.textContent?.trim()),
                    Number(item.querySelector('.win3')?.textContent?.trim()),
                    Number(item.querySelector('.win4')?.textContent?.trim()),
                    Number(item.querySelector('.win5')?.textContent?.trim()),
                    Number(item.querySelector('.win6')?.textContent?.trim()),
                ];
                const additional = Number(item.querySelector('.additional')?.textContent?.trim());

                const jackpotEl = item.querySelector('.jackpotPrize');
                const jackpotText = jackpotEl?.textContent?.trim() || '';
                const jackpotAmount = Number(jackpotText.replace(/[^0-9.]/g, ''));

                const winningShares: { group: string; prizeAmount: number; count: number }[] = [];
                const rows = item.querySelectorAll('.tableWinningShares tbody tr');
                rows.forEach(row => {
                    const cols = row.querySelectorAll('td');
                    if (cols.length >= 3) {
                        const group = cols[0].textContent?.trim() || '';
                        let prizeAmount = Number(cols[1].textContent?.trim().replace(/[^\d.]/g, ''));
                        const count = Number(cols[2].textContent?.trim().replace(/[^\d.]/g, ''));

                        if (group.includes('Group 1') && (prizeAmount === 0 || isNaN(prizeAmount)) && jackpotAmount > 0) {
                            prizeAmount = jackpotAmount;
                        }

                        winningShares.push({ group, prizeAmount, count });
                    }
                });

                return { drawNo, drawDate, winning, additional, winningShares };
            });
        } else if (gameType === 'Sweep') {
            result = await page.evaluate(() => {
                const item = document.querySelector('.tables-wrap');
                if (!item) return null;

                const drawNoText = item.querySelector('.drawNumber')?.textContent?.trim() || '';
                const drawNo = Number(drawNoText.split(' ')[2]);
                const rawDrawDate = item.querySelector('.drawDate')?.textContent?.trim() || '';
                const dateObj = new Date(`${rawDrawDate} GMT+0800`);
                const drawDate = dateObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Singapore' });

                const winning = [
                    Number(item.querySelector('.valueFirstPrize')?.textContent?.trim()),
                    Number(item.querySelector('.valueSecondPrize')?.textContent?.trim()),
                    Number(item.querySelector('.valueThirdPrize')?.textContent?.trim()),
                ];

                const getNumbers = (nodes: NodeListOf<Element>) => Array.from(nodes).map(n => Number(n.textContent));

                const jackpotLucky = item.querySelectorAll('.tbodyJackpot');
                const jackpot = jackpotLucky[0] ? getNumbers(jackpotLucky[0].querySelectorAll('td')) : [];
                const lucky = jackpotLucky[1] ? getNumbers(jackpotLucky[1].querySelectorAll('td')) : [];

                const prizes = item.querySelectorAll('.expandable-content');
                const gift = prizes[0] ? getNumbers(prizes[0].querySelectorAll('td')) : [];
                const consolation = prizes[1] ? getNumbers(prizes[1].querySelectorAll('td')) : [];
                const participation = prizes[2] ? getNumbers(prizes[2].querySelectorAll('td')) : [];
                const twoD = prizes[3] ? getNumbers(prizes[3].querySelectorAll('td')) : [];

                return { drawNo, drawDate, winning, jackpot, lucky, gift, consolation, participation, twoD };
            });
        }

        await page.close();
        return result;
    } catch (e: any) {
        log(`[Cron] Scrape error for ${gameType}: ${e.message}`, 'ERROR');
        return null;
    } finally {
        await browser.close();
    }
}

// Save result to database
async function saveResult(gameType: GameType, result: any): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
        const [rows]: any = await connection.query(
            'SELECT id, source FROM results WHERE type = ? AND draw_number = ?',
            [gameType, result.drawNo]
        );

        if (rows.length > 0) {
            if (rows[0].source === 'manual') {
                log(`[Cron] Skipping manual entry for ${gameType} draw ${result.drawNo}`, 'INFO');
                connection.release();
                return false;
            }
            await connection.query(
                'UPDATE results SET data = ?, draw_date = ?, updated_at = NOW() WHERE id = ?',
                [JSON.stringify(result), result.drawDate, rows[0].id]
            );
            log(`[Cron] Updated ${gameType} draw ${result.drawNo}`, 'INFO');
        } else {
            await connection.query(
                'INSERT INTO results (type, draw_date, draw_number, data, source) VALUES (?, ?, ?, ?, ?)',
                [gameType, result.drawDate, result.drawNo, JSON.stringify(result), 'scrape']
            );
            log(`[Cron] Inserted new ${gameType} draw ${result.drawNo}`, 'INFO');
        }
        connection.release();
        return true;
    } catch (e: any) {
        log(`[Cron] Error saving ${gameType} result: ${e.message}`, 'ERROR');
        connection.release();
        return false;
    }
}

// Check if scraped result is for today
function isResultForToday(result: any): boolean {
    const sgtDate = getSGTDate();
    const today = `${sgtDate.getFullYear()}-${String(sgtDate.getMonth() + 1).padStart(2, '0')}-${String(sgtDate.getDate()).padStart(2, '0')}`;
    return result.drawDate === today;
}

// Main handler
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const gameTypeParam = searchParams.get('game')?.toUpperCase() as GameType | 'ALL' | null;
    const retryCount = parseInt(searchParams.get('retry') || '0', 10);
    const forceRun = searchParams.get('force') === 'true';

    if (!gameTypeParam) {
        return NextResponse.json({
            success: false,
            message: 'Missing game parameter. Use ?game=4D, ?game=Toto, ?game=Sweep, or ?game=all'
        }, { status: 400 });
    }

    const games: GameType[] = gameTypeParam === 'ALL'
        ? ['4D', 'Toto', 'Sweep']
        : [gameTypeParam as GameType];

    const results: { game: string; success: boolean; message: string }[] = [];

    for (const gameType of games) {
        log(`[Cron] ============ ${gameType} SCRAPE START (retry ${retryCount}/${MAX_RETRIES}) ============`, 'INFO');

        // Get schedule
        const schedule = await getSchedule(gameType);
        if (!schedule) {
            log(`[Cron] No schedule found for ${gameType}`, 'WARN');
            results.push({ game: gameType, success: false, message: 'No schedule found' });
            continue;
        }

        // Check if it's a draw day (unless forced)
        if (!forceRun && !isDrawDay(schedule)) {
            log(`[Cron] Not a draw day for ${gameType}, skipping`, 'INFO');
            results.push({ game: gameType, success: false, message: 'Not a draw day' });
            continue;
        }

        // Check if result already exists
        if (await resultExistsForToday(gameType)) {
            log(`[Cron] Result already exists for ${gameType} today`, 'INFO');
            results.push({ game: gameType, success: true, message: 'Result already exists' });
            continue;
        }

        // Attempt to scrape
        const result = await scrapeGame(gameType);

        if (!result || !result.drawNo) {
            log(`[Cron] Failed to scrape ${gameType} - no data returned`, 'WARN');

            // Schedule retry if within limits
            if (retryCount < MAX_RETRIES) {
                const nextRetry = retryCount + 1;
                log(`[Cron] Will retry ${gameType} (attempt ${nextRetry}/${MAX_RETRIES}) in 5 minutes`, 'INFO');
                results.push({
                    game: gameType,
                    success: false,
                    message: `Scrape failed, retry ${nextRetry}/${MAX_RETRIES} scheduled`
                });
            } else {
                log(`[Cron] ${gameType} scrape failed after ${MAX_RETRIES} retries (8 hours), giving up`, 'ERROR');
                results.push({
                    game: gameType,
                    success: false,
                    message: `Scrape failed after ${MAX_RETRIES} retries`
                });
            }
            continue;
        }

        // Check if result is for today
        if (!isResultForToday(result)) {
            log(`[Cron] ${gameType} result is for ${result.drawDate}, not today - result not available yet`, 'WARN');

            if (retryCount < MAX_RETRIES) {
                const nextRetry = retryCount + 1;
                log(`[Cron] Will retry ${gameType} (attempt ${nextRetry}/${MAX_RETRIES}) in 5 minutes`, 'INFO');
                results.push({
                    game: gameType,
                    success: false,
                    message: `Result not for today (${result.drawDate}), retry ${nextRetry}/${MAX_RETRIES}`
                });
            } else {
                log(`[Cron] ${gameType} - Today's result not found after ${MAX_RETRIES} retries`, 'ERROR');
                results.push({
                    game: gameType,
                    success: false,
                    message: `Today's result not found after ${MAX_RETRIES} retries`
                });
            }
            continue;
        }

        // Save result
        const saved = await saveResult(gameType, result);
        if (!saved) {
            results.push({ game: gameType, success: false, message: 'Failed to save result' });
            continue;
        }

        // Purge Cloudflare cache
        log(`[Cron] Purging Cloudflare cache for ${gameType}`, 'INFO');
        await purgeGameCache(gameType, result.drawDate);

        // Update TOTO cascade status after successful scrape
        if (gameType === 'Toto') {
            try {
                const cascadeStatus = await updateTotoCascadeStatus(result as TotoModel);
                log(`[Cron] TOTO cascade status updated: ${cascadeStatus.consecutiveNoWinner} consecutive no-winner draws, cascade=${cascadeStatus.isCascadeDraw}`, 'INFO');
            } catch (e: any) {
                log(`[Cron] Failed to update cascade status: ${e.message}`, 'WARN');
            }
        }

        log(`[Cron] ============ ${gameType} SCRAPE SUCCESS ============`, 'INFO');
        results.push({
            game: gameType,
            success: true,
            message: `Successfully scraped draw ${result.drawNo} (${result.drawDate})`
        });
    }

    const allSuccess = results.every(r => r.success);
    const anyNeedsRetry = results.some(r => r.message.includes('retry'));

    return NextResponse.json({
        success: allSuccess,
        needsRetry: anyNeedsRetry,
        retryCount,
        maxRetries: MAX_RETRIES,
        results,
    });
}
