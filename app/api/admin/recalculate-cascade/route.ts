import { NextResponse } from 'next/server';
import { recalculateCascadeStatus, getTotoCascadeStatus } from '@/lib/schedule-utils';
import { log } from '@/lib/logger';

/**
 * API endpoint to recalculate TOTO cascade status from existing results
 * GET /api/admin/recalculate-cascade
 */
export async function GET() {
    try {
        log('[Admin] Recalculating TOTO cascade status...', 'INFO');

        const newStatus = await recalculateCascadeStatus();

        log(`[Admin] Cascade status recalculated: ${newStatus.consecutiveNoWinner} consecutive no-winner draws, cascade=${newStatus.isCascadeDraw}`, 'INFO');

        return NextResponse.json({
            success: true,
            message: 'Cascade status recalculated successfully',
            status: {
                consecutiveNoWinner: newStatus.consecutiveNoWinner,
                isCascadeDraw: newStatus.isCascadeDraw,
                lastCheckedDrawNo: newStatus.lastCheckedDrawNo,
            }
        });
    } catch (e: any) {
        log(`[Admin] Error recalculating cascade status: ${e.message}`, 'ERROR');
        return NextResponse.json({
            success: false,
            message: 'Failed to recalculate cascade status: ' + e.message
        }, { status: 500 });
    }
}
