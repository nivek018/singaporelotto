import pool from "@/lib/db";
import { FourDModel, TotoModel, SweepModel } from "@/lib/types";

export type Timeframe = '30days' | '3months' | '6months' | '1year';

function getDateFilter(timeframe: Timeframe): string {
    switch (timeframe) {
        case '30days': return 'DATE_SUB(NOW(), INTERVAL 30 DAY)';
        case '3months': return 'DATE_SUB(NOW(), INTERVAL 3 MONTH)';
        case '6months': return 'DATE_SUB(NOW(), INTERVAL 6 MONTH)';
        case '1year': return 'DATE_SUB(NOW(), INTERVAL 1 YEAR)';
        default: return 'DATE_SUB(NOW(), INTERVAL 30 DAY)';
    }
}

export async function getStats(type: '4D' | 'Toto' | 'Sweep', timeframe: Timeframe = '30days') {
    const dateFilter = getDateFilter(timeframe);
    const [rows]: any = await pool.query(
        `SELECT data FROM results WHERE type = ? AND draw_date >= ${dateFilter}`,
        [type]
    );

    const results = rows.map((row: any) => {
        let data = row.data;
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch (e) { return null; }
        }
        return data;
    }).filter(Boolean);

    if (type === '4D') return calculate4DStats(results);
    if (type === 'Toto') return calculateTotoStats(results);
    if (type === 'Sweep') return calculateSweepStats(results);
    return null;
}

function calculate4DStats(results: FourDModel[]) {
    const counts: Record<string, number> = {};

    // Initialize 0-9 with 0
    for (let i = 0; i <= 9; i++) {
        counts[i.toString()] = 0;
    }

    results.forEach(res => {
        // Include all prizes: Winning, Starter, Consolation
        const allNumbers = [...res.winning, ...res.starter, ...res.consolation];
        allNumbers.forEach(num => {
            const numStr = num.toString().padStart(4, '0');
            // Split into individual digits
            for (const char of numStr) {
                counts[char] = (counts[char] || 0) + 1;
            }
        });
    });

    // Full frequency for chart
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const frequency = sorted.map(([num, count]) => ({ number: num, count })).sort((a, b) => Number(a.number) - Number(b.number));

    // User requested 5 hot and 5 cold for 4D
    const hot = sorted.slice(0, 5).map(([num, count]) => ({ number: num, count }));
    const cold = sorted.slice(-5).map(([num, count]) => ({ number: num, count }));

    return { hot, cold, frequency };
}

function calculateTotoStats(results: TotoModel[]) {
    const counts: Record<string, number> = {};
    results.forEach(res => {
        // Include winning numbers and additional number
        const allNumbers = [...res.winning, res.additional];
        allNumbers.forEach(num => {
            const numStr = num.toString();
            counts[numStr] = (counts[numStr] || 0) + 1;
        });
    });

    // Ensure all numbers 1-49 are represented
    for (let i = 1; i <= 49; i++) {
        const numStr = i.toString();
        if (!counts[numStr]) counts[numStr] = 0;
    }

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    // Full frequency for chart
    const frequency = sorted.map(([num, count]) => ({ number: num, count })).sort((a, b) => Number(a.number) - Number(b.number));

    const hot = sorted.slice(0, 6).map(([num, count]) => ({ number: num, count }));
    const cold = sorted.slice(-6).map(([num, count]) => ({ number: num, count }));

    // Prize Trend (Group 1)
    const prizeTrend = results
        .map(res => ({
            drawNo: res.drawNo,
            drawDate: res.drawDate,
            amount: res.winningShares[0]?.prizeAmount || 0,
            winners: res.winningShares[0]?.count || 0
        }))
        .sort((a, b) => new Date(a.drawDate).getTime() - new Date(b.drawDate).getTime());

    return { hot, cold, frequency, prizeTrend };
}

function calculateSweepStats(results: SweepModel[]) {
    const firstDigitCounts: Record<string, number> = {};
    const otherDigitCounts: Record<string, number> = {};

    // Initialize 10-44 for first digits
    for (let i = 10; i <= 44; i++) {
        firstDigitCounts[i.toString()] = 0;
    }
    // Initialize 0-9 for other digits
    for (let i = 0; i <= 9; i++) {
        otherDigitCounts[i.toString()] = 0;
    }

    results.forEach(res => {
        const allNumbers = [...res.winning, ...res.jackpot, ...res.lucky, ...res.gift, ...res.consolation, ...res.participation, ...res.twoD];
        allNumbers.forEach(num => {
            const numStr = num.toString().padStart(7, '0');

            // First part (2 digits)
            const firstPart = numStr.substring(0, 2);
            if (firstDigitCounts[firstPart] !== undefined) {
                firstDigitCounts[firstPart]++;
            }

            // Other parts (single digits)
            for (let i = 2; i < 7; i++) {
                const digit = numStr[i];
                if (otherDigitCounts[digit] !== undefined) {
                    otherDigitCounts[digit]++;
                }
            }
        });
    });

    // Charts Data (Sorted by number)
    const firstDigitChart = Object.entries(firstDigitCounts)
        .map(([num, count]) => ({ number: num, count }))
        .sort((a, b) => Number(a.number) - Number(b.number));

    const otherDigitChart = Object.entries(otherDigitCounts)
        .map(([num, count]) => ({ number: num, count }))
        .sort((a, b) => Number(a.number) - Number(b.number));

    // Hot/Cold for First Digits (10-44) - User requested 6 items
    const sortedFirst = Object.entries(firstDigitCounts).sort((a, b) => b[1] - a[1]);
    const hotFirst = sortedFirst.slice(0, 6).map(([num, count]) => ({ number: num, count }));
    const coldFirst = sortedFirst.slice(-6).map(([num, count]) => ({ number: num, count }));

    // Hot/Cold for Other Digits (0-9) - User requested 6 items
    const sortedOther = Object.entries(otherDigitCounts).sort((a, b) => b[1] - a[1]);
    const hotOther = sortedOther.slice(0, 6).map(([num, count]) => ({ number: num, count }));
    const coldOther = sortedOther.slice(-6).map(([num, count]) => ({ number: num, count }));

    return { firstDigitChart, otherDigitChart, hotFirst, coldFirst, hotOther, coldOther };
}
