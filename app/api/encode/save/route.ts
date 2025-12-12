import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { purgeGameCache } from '@/lib/cloudflare';
import { log } from '@/lib/logger';

// Valid game types
const VALID_TYPES = ['4D', 'Toto', 'Sweep'] as const;

// Validate date format (YYYY-MM-DD)
function isValidDate(dateStr: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { password, type, drawDate, drawNo, data } = body;

        // Security: Only allow env password, no fallbacks
        if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
        }

        // Basic required field check
        if (!type || !drawDate || !drawNo || !data) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        // Strict input validation
        if (!VALID_TYPES.includes(type)) {
            return NextResponse.json({ success: false, message: 'Invalid type. Must be 4D, Toto, or Sweep' }, { status: 400 });
        }

        if (!isValidDate(drawDate)) {
            return NextResponse.json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD' }, { status: 400 });
        }

        const drawNumber = parseInt(drawNo, 10);
        if (isNaN(drawNumber) || drawNumber <= 0) {
            return NextResponse.json({ success: false, message: 'Invalid draw number. Must be positive integer' }, { status: 400 });
        }

        if (typeof data !== 'object' || data === null) {
            return NextResponse.json({ success: false, message: 'Invalid data format. Must be an object' }, { status: 400 });
        }

        const connection = await pool.getConnection();
        let isUpdate = false;

        try {
            // Check if exists
            const [rows]: any = await connection.query(
                'SELECT id FROM results WHERE type = ? AND draw_number = ?',
                [type, drawNo]
            );

            if (rows.length > 0) {
                // Update
                await connection.query(
                    'UPDATE results SET data = ?, draw_date = ?, source = ?, updated_at = NOW() WHERE id = ?',
                    [JSON.stringify(data), drawDate, 'manual', rows[0].id]
                );
                isUpdate = true;
                log(`[Admin] Updated ${type} draw ${drawNo} (${drawDate}) - manual`, 'INFO');
            } else {
                // Insert
                await connection.query(
                    'INSERT INTO results (type, draw_date, draw_number, data, source) VALUES (?, ?, ?, ?, ?)',
                    [type, drawDate, drawNo, JSON.stringify(data), 'manual']
                );
                log(`[Admin] Inserted new ${type} draw ${drawNo} (${drawDate}) - manual`, 'INFO');
            }

            // Purge Cloudflare cache for the affected game
            log(`[Admin] Purging Cloudflare cache for ${type} after manual ${isUpdate ? 'update' : 'insert'}`, 'INFO');
            await purgeGameCache(type as '4D' | 'Toto' | 'Sweep', drawDate);

            return NextResponse.json({
                success: true,
                message: `Result ${isUpdate ? 'updated' : 'saved'} successfully. Cache purged.`
            });
        } finally {
            connection.release();
        }
    } catch (error: any) {
        log(`[Admin] Save error: ${error.message}`, 'ERROR');
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
