import { MetadataRoute } from 'next';
import pool from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://sglottoresult.com';

interface ResultRow {
    draw_date: string;
    updated_at: Date;
    type: '4D' | 'Toto' | 'Sweep';
}

// Format date in Singapore timezone: 2025-12-10T14:24:00+08:00
function formatSGTDate(date: Date): string {
    // Convert to Singapore time and format as ISO string with +08:00 offset
    const sgtOffset = 8 * 60; // Singapore is UTC+8
    const localOffset = date.getTimezoneOffset();
    const sgtDate = new Date(date.getTime() + (sgtOffset + localOffset) * 60 * 1000);

    const year = sgtDate.getFullYear();
    const month = String(sgtDate.getMonth() + 1).padStart(2, '0');
    const day = String(sgtDate.getDate()).padStart(2, '0');
    const hours = String(sgtDate.getHours()).padStart(2, '0');
    const minutes = String(sgtDate.getMinutes()).padStart(2, '0');
    const seconds = String(sgtDate.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+08:00`;
}

async function getLastUpdated(type: '4D' | 'Toto' | 'Sweep'): Promise<string | null> {
    try {
        const [rows]: any = await pool.query(
            'SELECT updated_at FROM results WHERE type = ? ORDER BY updated_at DESC LIMIT 1',
            [type]
        );
        if (rows.length > 0 && rows[0].updated_at) {
            return formatSGTDate(new Date(rows[0].updated_at));
        }
        return null;
    } catch (e) {
        console.error(`Error fetching last updated for ${type}:`, e);
        return null;
    }
}

async function getMostRecentUpdate(): Promise<string | null> {
    try {
        const [rows]: any = await pool.query(
            'SELECT updated_at FROM results ORDER BY updated_at DESC LIMIT 1'
        );
        if (rows.length > 0 && rows[0].updated_at) {
            return formatSGTDate(new Date(rows[0].updated_at));
        }
        return null;
    } catch (e) {
        console.error('Error fetching most recent update:', e);
        return null;
    }
}

async function getAllResultDates(): Promise<ResultRow[]> {
    try {
        const [rows]: any = await pool.query(
            'SELECT type, draw_date, updated_at FROM results ORDER BY draw_date DESC'
        );
        return rows.map((row: any) => ({
            type: row.type,
            draw_date: new Date(row.draw_date).toISOString().split('T')[0],
            updated_at: new Date(row.updated_at),
        }));
    } catch (e) {
        console.error('Error fetching all result dates:', e);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [lastUpdated4D, lastUpdatedToto, lastUpdatedSweep, lastUpdatedAny, allResults] = await Promise.all([
        getLastUpdated('4D'),
        getLastUpdated('Toto'),
        getLastUpdated('Sweep'),
        getMostRecentUpdate(),
        getAllResultDates(),
    ]);

    const now = formatSGTDate(new Date());

    // Static pages with updated priorities per user spec
    const staticPages: MetadataRoute.Sitemap = [
        // Homepage - priority 1, changefreq always
        {
            url: BASE_URL,
            lastModified: lastUpdatedAny || now,
            changeFrequency: 'always',
            priority: 1,
        },
        // 4D Pages - priority 1, changefreq always
        {
            url: `${BASE_URL}/4d`,
            lastModified: lastUpdated4D || now,
            changeFrequency: 'always',
            priority: 1,
        },
        {
            url: `${BASE_URL}/4d/history`,
            lastModified: lastUpdated4D || now,
            changeFrequency: 'always',
            priority: 1,
        },
        // Toto Pages - priority 1, changefreq always
        {
            url: `${BASE_URL}/toto`,
            lastModified: lastUpdatedToto || now,
            changeFrequency: 'always',
            priority: 1,
        },
        {
            url: `${BASE_URL}/toto/history`,
            lastModified: lastUpdatedToto || now,
            changeFrequency: 'always',
            priority: 1,
        },
        // Sweep Pages - priority 1, changefreq monthly
        {
            url: `${BASE_URL}/sweep`,
            lastModified: lastUpdatedSweep || now,
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: `${BASE_URL}/sweep/history`,
            lastModified: lastUpdatedSweep || now,
            changeFrequency: 'monthly',
            priority: 1,
        },
        // Schedule Page - priority 0.7, changefreq monthly
        {
            url: `${BASE_URL}/schedule`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        // Jackpot Page - priority 0.8, changefreq weekly
        {
            url: `${BASE_URL}/jackpot`,
            lastModified: lastUpdatedToto || now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];

    // Dynamic date-based pages - priority 0.9, changefreq daily
    // lastmod ONLY updates when result is edited from admin dashboard
    const datePages: MetadataRoute.Sitemap = allResults.map((result) => {
        const gameSlug = result.type === '4D' ? '4d' : result.type.toLowerCase();
        return {
            url: `${BASE_URL}/${gameSlug}/${result.draw_date}`,
            lastModified: formatSGTDate(result.updated_at),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        };
    });

    return [...staticPages, ...datePages];
}
