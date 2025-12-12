export interface FourDModel {
    drawNo: number;
    drawDate: string;
    winning: number[];
    starter: number[];
    consolation: number[];
}

export interface TotoPrizeShareModel {
    group: string;
    prizeAmount: number;
    count: number;
}

export interface TotoModel {
    drawNo: number;
    drawDate: string;
    winning: number[];
    additional: number;
    winningShares: TotoPrizeShareModel[];
}

export interface SweepModel {
    drawNo: number;
    drawDate: string;
    winning: number[];
    jackpot: number[];
    lucky: number[];
    gift: number[];
    consolation: number[];
    participation: number[];
    twoD: number[];
}

export type LotteryType = '4D' | 'Toto' | 'Sweep';

export interface ScheduleModel {
    id: number;
    gameType: LotteryType;
    drawDays: string;
    drawTime: string;
    cascadeDrawTime: string | null;  // For TOTO cascade draws (9:30 PM)
    description: string | null;
    salesCloseTime: string | null;
}

export interface CascadeStatus {
    consecutiveNoWinner: number;
    isCascadeDraw: boolean;
    lastCheckedDrawNo: number | null;
    updatedAt: Date;
}

