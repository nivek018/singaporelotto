'use client';

import { TrendingUp, Trophy, Users, Hash, DollarSign, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PrizeTrendChartProps {
    data: { drawNo: string; drawDate: string; amount: number; winners: number }[];
}

export function PrizeTrendChart({ data }: PrizeTrendChartProps) {
    if (!data || data.length === 0) return null;

    // Calculate Stats
    const totalDraws = data.length;
    const totalPrize = data.reduce((acc, curr) => acc + curr.amount, 0);
    const avgPrize = totalPrize / totalDraws;
    const maxPrize = Math.max(...data.map(d => d.amount));
    const totalWinners = data.reduce((acc, curr) => acc + curr.winners, 0);
    const currentPrize = data[data.length - 1].amount;

    const minAmount = Math.min(...data.map(d => d.amount));
    const range = maxPrize - minAmount || 1;

    // SVG Dimensions
    const width = 1000;
    const height = 350;
    const padding = 50;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    // Generate Points
    const points = data.map((d, i) => {
        const x = padding + (i / (data.length - 1)) * graphWidth;
        const y = height - padding - ((d.amount - minAmount) / range) * graphHeight;
        return `${x},${y}`;
    }).join(' ');

    // Area Path (Close the loop at the bottom)
    const areaPath = `
        ${points} 
        L ${width - padding},${height - padding} 
        L ${padding},${height - padding} 
        Z
    `;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">Prize History</h3>
            </div>

            {/* Chart Area */}
            <div className="p-6 relative">
                <div className="w-full overflow-x-auto custom-scrollbar">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[800px]">
                        <defs>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Grid Lines & Y-Axis Labels */}
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                            const y = height - padding - ratio * graphHeight;
                            return (
                                <g key={ratio}>
                                    <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e5e7eb" strokeDasharray="4" strokeWidth="1" />
                                    <text x={padding - 10} y={y + 4} textAnchor="end" className="text-[10px] fill-gray-400 font-mono">
                                        {formatCurrency(minAmount + ratio * range, 'USD', 0)}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Area Fill */}
                        <path d={areaPath} fill="url(#areaGradient)" />

                        {/* Line Stroke */}
                        <polyline
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            points={points}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Interactive Dots */}
                        {data.map((d, i) => {
                            const x = padding + (i / (data.length - 1)) * graphWidth;
                            const y = height - padding - ((d.amount - minAmount) / range) * graphHeight;
                            return (
                                <g key={i} className="group cursor-pointer">
                                    <circle cx={x} cy={y} r="4" className="fill-white stroke-blue-500 stroke-[3px] group-hover:r-6 transition-all duration-300" />

                                    {/* Tooltip */}
                                    <foreignObject x={x - 80} y={y - 100} width="160" height="90" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                        <div className="bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-lg p-3 text-center shadow-xl border border-white/10 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                            <div className="font-bold text-gray-300 mb-1">{new Date(d.drawDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                            <div className="text-lg font-bold text-yellow-400 mb-1">{formatCurrency(d.amount)}</div>
                                            <div className="text-[10px] text-gray-400">Winners: {d.winners}</div>
                                        </div>
                                    </foreignObject>
                                </g>
                            );
                        })}

                        {/* X-Axis Labels (Show ~5 labels) */}
                        {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0).map((d, i) => {
                            const index = data.indexOf(d);
                            const x = padding + (index / (data.length - 1)) * graphWidth;
                            return (
                                <text key={i} x={x} y={height - 15} textAnchor="middle" className="text-[10px] fill-gray-500 font-bold uppercase">
                                    {new Date(d.drawDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </text>
                            );
                        })}
                    </svg>
                </div>
            </div>

            {/* Footer Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                <div className="p-4 text-center">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Avg. Jackpot Prize</div>
                    <div className="text-sm font-black text-gray-900 dark:text-white">{formatCurrency(avgPrize)}</div>
                </div>
                <div className="p-4 text-center">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Highest Jackpot</div>
                    <div className="text-sm font-black text-gray-900 dark:text-white">{formatCurrency(maxPrize)}</div>
                </div>
                <div className="p-4 text-center">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Total Draws</div>
                    <div className="text-sm font-black text-gray-900 dark:text-white">{totalDraws}</div>
                </div>
                <div className="p-4 text-center">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Jackpot Winners</div>
                    <div className="text-sm font-black text-gray-900 dark:text-white">{totalWinners}</div>
                </div>
                <div className="p-4 text-center col-span-2 md:col-span-1">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Current Jackpot</div>
                    <div className="text-sm font-black text-blue-600 dark:text-blue-400">{formatCurrency(currentPrize)}</div>
                </div>
            </div>
        </div>
    );
}
