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
    results.forEach(res => {
        // Include all prizes: Winning, Starter, Consolation
        const allNumbers = [...res.winning, ...res.starter, ...res.consolation];
        allNumbers.forEach(num => {
            const numStr = num.toString().padStart(4, '0');
            counts[numStr] = (counts[numStr] || 0) + 1;
        });
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const hot = sorted.slice(0, 6).map(([num, count]) => ({ number: num, count }));
    const cold = sorted.slice(-6).map(([num, count]) => ({ number: num, count }));

    return { hot, cold };
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

    // Ensure all numbers 1-49 are represented to find true "cold" numbers (0 appearances)
    for (let i = 1; i <= 49; i++) {
        const numStr = i.toString();
        if (!counts[numStr]) counts[numStr] = 0;
    }

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const hot = sorted.slice(0, 6).map(([num, count]) => ({ number: num, count }));
    const cold = sorted.slice(-6).map(([num, count]) => ({ number: num, count }));

    return { hot, cold };
}

function calculateSweepStats(results: SweepModel[]) {
    // Sweep Analysis:
    // First digit (10-44): Frequency for Line Chart
    // Other digits (0-9): Frequency for Hot/Cold (5 each)

    const firstDigitCounts: Record<string, number> = {};
    const otherDigitCounts: Record<string, number> = {};

    results.forEach(res => {
        const allNumbers = [...res.winning, ...res.jackpot, ...res.lucky, ...res.gift, ...res.consolation, ...res.participation, ...res.twoD];
        allNumbers.forEach(num => {
            const numStr = num.toString().padStart(7, '0');

            // First part (2 digits)
            const firstPart = numStr.substring(0, 2);
            firstDigitCounts[firstPart] = (firstDigitCounts[firstPart] || 0) + 1;

            // Other parts (single digits)
            for (let i = 2; i < 7; i++) {
                const digit = numStr[i];
                otherDigitCounts[digit] = (otherDigitCounts[digit] || 0) + 1;
            }
        });
    });

    // First Digit Chart Data (Sorted by number 10-44 for chart)
    const firstDigitChart = Object.entries(firstDigitCounts)
        .map(([num, count]) => ({ number: num, count }))
        .sort((a, b) => Number(a.number) - Number(b.number));

    // Other Digits Hot/Cold
    // Ensure 0-9 are represented
    for (let i = 0; i <= 9; i++) {
        const digit = i.toString();
        if (!otherDigitCounts[digit]) otherDigitCounts[digit] = 0;
    }

    const sortedOthers = Object.entries(otherDigitCounts).sort((a, b) => b[1] - a[1]);
    const hot = sortedOthers.slice(0, 5).map(([num, count]) => ({ number: num, count }));
    const cold = sortedOthers.slice(-5).map(([num, count]) => ({ number: num, count }));

    return { firstDigitChart, hot, cold };
}
