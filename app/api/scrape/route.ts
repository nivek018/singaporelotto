import { NextResponse } from 'next/server';
import { runScraper } from '@/lib/scraper';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get('startDate') || undefined;
        const endDate = searchParams.get('endDate') || undefined;

        const result = await runScraper(startDate, endDate);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
