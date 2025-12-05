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
            <div className="space-y-3">
                {data.map((item) => {
                    const width = (item.count / maxCount) * 100;
                    return (
                        <div key={item.number} className="flex items-center gap-4 group relative">
                            <div className="w-8 text-right text-sm font-mono font-bold text-gray-500 dark:text-gray-400">{item.number}</div>
                            <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-700/50 rounded-r-full overflow-visible relative">
                                <div
                                    className={`h-full ${color} rounded-r-full transition-all duration-500 ease-out relative group-hover:brightness-110`}
                                    style={{ width: `${width}%` }}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl flex flex-col items-center gap-1 min-w-[80px]">
                                            <div className={`w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center font-bold text-sm ${color} text-white shadow-sm`}>
                                                {item.number}
                                            </div>
                                            <span className="font-bold">{item.count} times</span>
                                            {/* Arrow */}
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
