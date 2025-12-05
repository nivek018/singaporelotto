'use client';

import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PrizeTrendChartProps {
    data: { drawNo: string; drawDate: string; amount: number }[];
}

export function PrizeTrendChart({ data }: PrizeTrendChartProps) {
    if (!data || data.length === 0) return null;

    const maxAmount = Math.max(...data.map(d => d.amount));
    const minAmount = Math.min(...data.map(d => d.amount));
    const range = maxAmount - minAmount || 1;

    // SVG Dimensions
    const width = 800;
    const height = 300;
    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    // Points
    const points = data.map((d, i) => {
        const x = padding + (i / (data.length - 1)) * graphWidth;
        const y = height - padding - ((d.amount - minAmount) / range) * graphHeight;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-center gap-2 mb-6 text-gray-700 dark:text-gray-300">
                <TrendingUp className="w-5 h-5" />
                <h3 className="font-bold text-lg">Group 1 Prize Trend</h3>
            </div>
            <div className="w-full overflow-x-auto">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[600px]">
                    {/* Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                        const y = height - padding - ratio * graphHeight;
                        return (
                            <g key={ratio}>
                                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e5e7eb" strokeDasharray="4" />
                                <text x={padding - 10} y={y + 4} textAnchor="end" className="text-[10px] fill-gray-400">
                                    {formatCurrency(minAmount + ratio * range).split('.')[0]}
                                </text>
                            </g>
                        );
                    })}

                    {/* Line */}
                    <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        points={points}
                        className="drop-shadow-md"
                    />

                    {/* Dots */}
                    {data.map((d, i) => {
                        const x = padding + (i / (data.length - 1)) * graphWidth;
                        const y = height - padding - ((d.amount - minAmount) / range) * graphHeight;
                        return (
                            <g key={i} className="group cursor-pointer">
                                <circle cx={x} cy={y} r="4" className="fill-blue-500 stroke-white stroke-2 group-hover:r-6 transition-all" />
                                {/* Tooltip */}
                                <foreignObject x={x - 75} y={y - 80} width="150" height="70" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <div className="bg-gray-900 text-white text-xs rounded-lg p-2 text-center shadow-xl">
                                        <div className="font-bold">{d.drawNo}</div>
                                        <div>{new Date(d.drawDate).toLocaleDateString()}</div>
                                        <div className="text-yellow-400 font-bold mt-1">{formatCurrency(d.amount)}</div>
                                    </div>
                                </foreignObject>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
