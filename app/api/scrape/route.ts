import { NextResponse } from 'next/server';
import { runScraper } from '@/lib/scraper';

export async function GET() {
    try {
        const result = await runScraper();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
