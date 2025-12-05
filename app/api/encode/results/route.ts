import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get('page')) || 1;
        const limit = Number(searchParams.get('limit')) || 10;
        const offset = (page - 1) * limit;

        const connection = await pool.getConnection();
        try {
            const [rows]: any = await connection.query(
                'SELECT * FROM results ORDER BY draw_date DESC LIMIT ? OFFSET ?',
                [limit, offset]
            );
            const [countRows]: any = await connection.query('SELECT COUNT(*) as count FROM results');
            const total = countRows[0].count;

            return NextResponse.json({
                data: rows,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } finally {
            connection.release();
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });
        }

        const connection = await pool.getConnection();
        try {
            await connection.query('DELETE FROM results WHERE id = ?', [id]);
            return NextResponse.json({ success: true, message: 'Deleted successfully' });
        } finally {
            connection.release();
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, data, drawDate, drawNo, type } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });
        }

        const connection = await pool.getConnection();
        try {
            await connection.query(
                'UPDATE results SET data = ?, draw_date = ?, draw_number = ?, type = ?, updated_at = NOW() WHERE id = ?',
                [JSON.stringify(data), drawDate, drawNo, type, id]
            );
            return NextResponse.json({ success: true, message: 'Updated successfully' });
        } finally {
            connection.release();
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
