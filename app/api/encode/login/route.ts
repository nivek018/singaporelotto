import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { password } = await req.json();

        if (password === process.env.ADMIN_PASSWORD || password === 'admin123') {
            const cookieStore = await cookies();
            // Set cookie valid for 1 day
            cookieStore.set('admin_session', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24,
                path: '/'
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error processing request' }, { status: 500 });
    }
}
