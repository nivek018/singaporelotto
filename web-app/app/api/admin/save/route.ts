import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { password, type, drawDate, drawNo, data } = body;

        // Simple auth check
        if (password !== process.env.ADMIN_PASSWORD && password !== 'admin123') { // Default fallback
            return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
        }

        if (!type || !drawDate || !drawNo || !data) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const connection = await pool.getConnection();
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
            } else {
                // Insert
                await connection.query(
                    'INSERT INTO results (type, draw_date, draw_number, data, source) VALUES (?, ?, ?, ?, ?)',
                    [type, drawDate, drawNo, JSON.stringify(data), 'manual']
                );
            }
            return NextResponse.json({ success: true, message: 'Result saved successfully' });
        } finally {
            connection.release();
        }
    } catch (error: any) {
        console.error('Save error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
