import { SweepResult } from "@/components/results/Sweep";
import { Metadata } from "next";
import pool from "@/lib/db";
import { SweepModel } from "@/lib/types";
import { notFound } from "next/navigation";
import { PastDrawResults } from "@/components/PastDrawResults";
import { formatCurrency } from "@/lib/utils";
import { Calendar, Hash, Gift, Ticket, ArrowLeft, ArrowRight, Info } from "lucide-react";

interface PageProps {
    params: Promise<{ date: string }>;
}

async function getResultByDate(date: string): Promise<SweepModel | null> {
    try {
        console.log('Sweep date query for:', date);
        const [rows]: any = await pool.query(
            'SELECT data FROM results WHERE type = "Sweep" AND DATE_FORMAT(draw_date, "%Y-%m-%d") = ?',
            [date]
        );
        console.log('Sweep rows found:', rows.length);
        if (rows.length === 0) return null;
        let data = rows[0].data;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        return data as SweepModel;
    } catch (e) {
        console.error('Error fetching Sweep result:', e);
        return null;
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { date } = await params;
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return {
        title: `Singapore Sweep Results - ${formattedDate} | Singapore Draw`,
        description: `Singapore Sweep winning numbers for ${formattedDate}. View the complete prize list including 1st, 2nd, 3rd prizes and all participation prizes.`,
        alternates: {
            canonical: `/sweep/${date}`,
        },
    };
}

export default async function SweepDatePage({ params }: PageProps) {
    const { date } = await params;
    const result = await getResultByDate(date);

    if (!result) {
        notFound();
    }

    const formattedDate = new Date(date).toLocaleDateString('en-SG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const shortDate = new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 px-4">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Singapore Sweep Results
                    </h1>
                    <p className="text-lg text-green-100 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Singapore Sweep Results - {formattedDate}. Find out if your ticket number is among the winners.
                    </p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Full Result */}
                <SweepResult data={result} />

                {/* About This Draw */}
                <section className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                            <Info className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">About This Draw</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                This Singapore Sweep draw took place on {formattedDate}. Singapore Sweep is drawn on the first Wednesday of every month.
                                Unlike other lottery games, Sweep tickets are pre-printed with 7-digit numbers and cannot be chosen by players.
                                Prizes must be claimed within 180 days from the draw date.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Navigation */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
                    <a
                        href="/sweep/history"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Browse All Results
                    </a>
                    <a
                        href="/sweep"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl shadow-sm hover:bg-green-700 transition-colors font-medium"
                    >
                        View Latest Results
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Past Draw Results */}
            <PastDrawResults />
        </main>
    );
}
