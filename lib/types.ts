export interface FourDModel {
    drawNo: number;
    drawDate: Date;
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
    drawDate: Date;
    winning: number[];
    additional: number;
    winningShares: TotoPrizeShareModel[];
}

export interface SweepModel {
    drawNo: number;
    drawDate: Date;
    winning: number[];
    jackpot: number[];
    lucky: number[];
    gift: number[];
    consolation: number[];
    participation: number[];
    twoD: number[];
}

export type LotteryType = '4D' | 'Toto' | 'Sweep';
