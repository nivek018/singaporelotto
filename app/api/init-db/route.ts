import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const connection = await pool.getConnection();
        await connection.query(`
      CREATE TABLE IF NOT EXISTS results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('4D', 'Toto', 'Sweep') NOT NULL,
        draw_date DATE NOT NULL,
        draw_number VARCHAR(50) NOT NULL,
        data JSON NOT NULL,
        source ENUM('scrape', 'manual') DEFAULT 'scrape',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_draw (type, draw_number)
      )
    `);
        connection.release();
        return NextResponse.json({ message: 'Database initialized successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
