'use client';

import { BarChart3 } from "lucide-react";

interface FrequencyChartProps {
    data: { number: string; count: number }[];
    maxCount: number;
    title: string;
    color?: string;
}

export function FrequencyChart({ data, maxCount, title, color = "bg-blue-500" }: FrequencyChartProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-center gap-2 mb-6 text-gray-700 dark:text-gray-300">
                <BarChart3 className="w-5 h-5" />
                <h3 className="font-bold text-lg">{title}</h3>
            </div>
            <div className="space-y-1.5">
                {data.map((item) => {
                    const widthPercent = (item.count / maxCount) * 100;
                    return (
                        <div key={item.number} className="flex items-center gap-2 group relative">
                            <div className="w-6 text-right text-xs font-mono font-bold text-gray-500 dark:text-gray-400">{item.number}</div>
                            <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-700/50 rounded-full relative">
                                <div
                                    className={`h-full ${color} rounded-full transition-all duration-500 ease-out group-hover:brightness-110`}
                                    style={{ width: `${Math.max(widthPercent, 5)}%` }}
                                />
                            </div>
                            <div className="w-8 text-xs font-mono font-bold text-gray-500 dark:text-gray-400">{item.count}</div>

                            {/* Tooltip - positioned above the row */}
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl flex items-center gap-2 whitespace-nowrap">
                                    <div className={`w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center font-bold text-sm ${color} text-white shadow-sm`}>
                                        {item.number}
                                    </div>
                                    <span className="font-bold">{item.count} times</span>
                                    {/* Arrow */}
                                    <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-gray-900"></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
