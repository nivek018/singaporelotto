'use server';

import { getStats, Timeframe } from "@/lib/stats";

export async function fetchStats(type: '4D' | 'Toto' | 'Sweep', timeframe: Timeframe) {
    return await getStats(type, timeframe);
}
