'use client';

import { useState, useRef } from "react";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PrizeTrendChartProps {
    data: { drawNo: string; drawDate: string; amount: number; winners: number }[];
}

export function PrizeTrendChart({ data }: PrizeTrendChartProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    if (!data || data.length === 0) return null;

    // Calculate Stats
    const totalDraws = data.length;
    const totalPrize = data.reduce((acc, curr) => acc + curr.amount, 0);
    const avgPrize = totalPrize / totalDraws;
    const maxPrize = Math.max(...data.map(d => d.amount));
    const totalWinners = data.reduce((acc, curr) => acc + curr.winners, 0);
    const currentPrize = data[data.length - 1].amount;

    // Start Y-axis from 0 for better visualization
    const minAmount = 0;
    const maxWithPadding = maxPrize * 1.1;
    const range = maxWithPadding - minAmount || 1;

    // SVG Dimensions
    const width = 1000;
    const height = 350;
    const padding = 50;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    // Calculate point positions
    const points = data.map((d, i) => ({
        x: padding + (i / (data.length - 1)) * graphWidth,
        y: height - padding - ((d.amount - minAmount) / range) * graphHeight
    }));

    // Generate smooth curve path using bezier curves
    const generateSmoothPath = () => {
        if (data.length < 2) return '';
        let path = `M ${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i === 0 ? i : i - 1];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;
            path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
        }
        return path;
    };

    const smoothLinePath = generateSmoothPath();
    const areaPath = `${smoothLinePath} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;

    // Handle mouse move to find nearest point
    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const scaleX = width / rect.width;
        const mouseX = (e.clientX - rect.left) * scaleX;

        // Find nearest point by X position
        let nearestIndex = 0;
        let minDistance = Infinity;
        points.forEach((p, i) => {
            const distance = Math.abs(p.x - mouseX);
            if (distance < minDistance) {
                minDistance = distance;
                nearestIndex = i;
            }
        });
        setHoveredIndex(nearestIndex);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

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
                    <svg
                        ref={svgRef}
                        viewBox={`0 0 ${width} ${height}`}
                        className="w-full h-auto min-w-[800px]"
                        style={{ overflow: 'visible' }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        <defs>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
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

                        {/* Smooth Line Stroke */}
                        <path
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            d={smoothLinePath}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Vertical line indicator */}
                        {hoveredIndex !== null && (
                            <line
                                x1={points[hoveredIndex].x}
                                y1={padding}
                                x2={points[hoveredIndex].x}
                                y2={height - padding}
                                stroke="#3b82f6"
                                strokeWidth="1"
                                strokeDasharray="4"
                                opacity="0.5"
                            />
                        )}

                        {/* Data points */}
                        {points.map((p, i) => (
                            <circle
                                key={i}
                                cx={p.x}
                                cy={p.y}
                                r={hoveredIndex === i ? 7 : 5}
                                className={`transition-all duration-150 ${hoveredIndex === i ? 'fill-blue-500 stroke-white' : 'fill-white stroke-blue-500'} stroke-[3px]`}
                            />
                        ))}

                        {/* Tooltip for hovered point */}
                        {hoveredIndex !== null && (
                            <foreignObject
                                x={hoveredIndex === 0 ? points[hoveredIndex].x - 20 : hoveredIndex === data.length - 1 ? points[hoveredIndex].x - 140 : points[hoveredIndex].x - 80}
                                y={points[hoveredIndex].y < 120 ? points[hoveredIndex].y + 15 : points[hoveredIndex].y - 100}
                                width="160"
                                height="90"
                                style={{ overflow: 'visible' }}
                            >
                                <div className="bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-lg p-3 text-center shadow-xl border border-white/10">
                                    <div className="font-bold text-gray-300 mb-1">{new Date(data[hoveredIndex].drawDate).toLocaleDateString('en-SG', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                    <div className="text-lg font-bold text-yellow-400 mb-1">{formatCurrency(data[hoveredIndex].amount)}</div>
                                    <div className="text-[10px] text-gray-400">Winners: {data[hoveredIndex].winners}</div>
                                </div>
                            </foreignObject>
                        )}

                        {/* X-Axis Labels */}
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

