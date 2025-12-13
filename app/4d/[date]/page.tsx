import { FourDResult } from "@/components/results/FourD";
import { Metadata } from "next";
import pool from "@/lib/db";
import { FourDModel } from "@/lib/types";
import { notFound } from "next/navigation";
import { PastDrawResults } from "@/components/PastDrawResults";
import { Calendar, Hash, Clock, ArrowLeft, ArrowRight, Info } from "lucide-react";
import { ResponsiveAd } from "@/components/ads/AdSense";

interface PageProps {
    params: Promise<{ date: string }>;
}

async function getResultByDate(date: string): Promise<FourDModel | null> {
    try {
        console.log('4D date query for:', date);
        const [rows]: any = await pool.query(
            'SELECT data FROM results WHERE type = "4D" AND DATE_FORMAT(draw_date, "%Y-%m-%d") = ?',
            [date]
        );
        console.log('4D rows found:', rows.length);
        if (rows.length === 0) return null;
        let data = rows[0].data;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        return data as FourDModel;
    } catch (e) {
        console.error('Error fetching 4D result:', e);
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
        title: `4D Results - ${formattedDate} | Singapore Draw`,
        description: `4D winning numbers for ${formattedDate}. View the complete prize list including 1st, 2nd, 3rd prizes and all consolation and starter prizes.`,
        alternates: {
            canonical: `/4d/${date}`,
        },
    };
}

export default async function FourDDatePage({ params }: PageProps) {
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
            <section className="relative overflow-hidden bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-500 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 px-4">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        4D Results
                    </h1>
                    <p className="text-lg text-yellow-100 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        4D Results - {formattedDate}. Check your numbers against the official winning combinations below.
                    </p>
                </div>
            </section>

            {/* Ad below hero */}
            <div className="max-w-4xl mx-auto px-4 pt-6">
                <ResponsiveAd />
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Full Result */}
                <FourDResult data={result} />

                {/* Ad above About This Draw */}
                <ResponsiveAd className="mt-8" />

                {/* About This Draw */}
                <section className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">About This Draw</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                This 4D draw took place on {formattedDate}. The winning numbers shown above are the official results
                                from Singapore Pools. Match all 4 digits in exact order to win the corresponding prize.
                                Prizes must be claimed within 180 days from the draw date.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Navigation */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
                    <a
                        href="/4d/history"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Browse All Results
                    </a>
                    <a
                        href="/4d"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-yellow-500 text-white rounded-xl shadow-sm hover:bg-yellow-600 transition-colors font-medium"
                    >
                        View Latest Results
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Ad above Past Draw Results */}
            <div className="max-w-4xl mx-auto px-4 pb-6">
                <ResponsiveAd />
            </div>

            {/* Past Draw Results */}
            <PastDrawResults />
        </main>
    );
}
