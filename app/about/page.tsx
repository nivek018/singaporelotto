import { Metadata } from 'next';
import { Target, Zap, Calendar, BarChart3, Smartphone, Shield, Users, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { PastDrawResults } from "@/components/PastDrawResults";

export const metadata: Metadata = {
    title: 'About Us | SG Lotto Results',
    description: 'Learn about SG Lotto Results - your trusted source for Singapore 4D, Toto, and Singapore Sweep lottery updates.',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 px-4">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">About SG Lotto Results</h1>
                    <p className="text-lg text-blue-100 dark:text-gray-300 max-w-2xl mx-auto">
                        Your Trusted Source for Singapore Lottery Updates
                    </p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Introduction */}
                <section className="mb-12">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        SG Lotto Results is a dedicated informational platform designed exclusively for Singapore. We provide real-time updates, comprehensive result history, and clear summaries for the official 4D, Toto, and Singapore Sweep draws.
                    </p>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                        Our focus is single-minded: to serve the Singaporean community with the fastest and most accurate lottery data available. Unlike generic international lottery sites, we do not mix results from other countries. Every page, chart, and update on this website is strictly tailored to the Singapore lottery system.
                    </p>
                </section>

                {/* Our Mission */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                            <Target className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        To empower players with timely and accurate information. We strive to be the most reliable reference for 4D, Toto, and Singapore Sweep results, helping you verify your winning numbers instantly and confidently.
                    </p>
                </section>

                {/* What We Offer */}
                <section className="mb-12">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">What We Offer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Real-Time Updates */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 rounded-lg bg-yellow-500 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Real-Time Result Updates</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                We publish the winning numbers immediately following the official Singapore Pools draws. No delays, no clutter.
                            </p>
                        </div>

                        {/* Complete Archive */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Complete Results Archive</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                Access a fully searchable database of past draw results. Whether you are checking yesterday&apos;s numbers or analyzing trends from last year, our archive is comprehensive and easy to navigate.
                            </p>
                        </div>

                        {/* Statistical Insights */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 rounded-lg bg-purple-500 flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Statistical Insights</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                We provide helpful tools for enthusiasts, including frequency charts, hot & cold number analysis, and historical draw patterns to aid in your strategy.
                            </p>
                        </div>

                        {/* Optimized for Speed */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
                                    <Smartphone className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Optimized for Speed</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                We know you want your results fast. Our site is designed with a clean, responsive interface that works perfectly on any device, allowing you to check the latest numbers immediately with minimal data usage.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Data Integrity */}
                <section className="mb-12 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 md:p-8 border border-emerald-100 dark:border-emerald-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Data Integrity & Independence</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Official Source Data</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                All results published on SG Lotto Results are sourced directly from official Singapore Pools draw announcements. We employ a rigorous verification process to ensuring that every number displayed matches the official outcome.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Independent Operation</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Please note that SG Lotto Results is an independent informational service. We are not affiliated with, associated with, or endorsed by Singapore Pools. We exist solely to organize and present public lottery data in a user-friendly format for the convenience of the public.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section className="text-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        We value transparency and user feedback. If you spot an error or have suggestions for improvement, please reach out to us.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Visit Contact Page
                    </Link>
                </section>
            </div>

            {/* Past Draw Results */}
            <PastDrawResults />
        </main>
    );
}
