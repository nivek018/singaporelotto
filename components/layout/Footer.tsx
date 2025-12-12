'use client';

import Link from 'next/link';
import { Trophy, Mail, Info, FileText, Home, Clock, History } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">SG Lotto Results</span>
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            Your trusted source for Singapore 4D, Toto, and Singapore Sweep lottery results. Updated in real-time after every official draw.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 transition-colors">
                                    <Home className="w-4 h-4" />
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 transition-colors">
                                    <Info className="w-4 h-4" />
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 transition-colors">
                                    <Mail className="w-4 h-4" />
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Lottery Results */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Lottery Results</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/4d" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 flex items-center gap-2 transition-colors">
                                    <Clock className="w-4 h-4" />
                                    4D Results
                                </Link>
                            </li>
                            <li>
                                <Link href="/toto" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 transition-colors">
                                    <Clock className="w-4 h-4" />
                                    Toto Results
                                </Link>
                            </li>
                            <li>
                                <Link href="/sweep" className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 flex items-center gap-2 transition-colors">
                                    <Clock className="w-4 h-4" />
                                    Singapore Sweep
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* History */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Results History</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/4d/history" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 flex items-center gap-2 transition-colors">
                                    <History className="w-4 h-4" />
                                    4D History
                                </Link>
                            </li>
                            <li>
                                <Link href="/toto/history" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 transition-colors">
                                    <History className="w-4 h-4" />
                                    Toto History
                                </Link>
                            </li>
                            <li>
                                <Link href="/sweep/history" className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 flex items-center gap-2 transition-colors">
                                    <History className="w-4 h-4" />
                                    Sweep History
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                    {/* Bottom Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-500 dark:text-gray-500 text-center md:text-left">
                            © {currentYear} SG Lotto Results. All rights reserved.
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/privacy" className="text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/disclaimer" className="text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                Disclaimer
                            </Link>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-6 max-w-2xl mx-auto leading-relaxed">
                        <span className="font-semibold">Disclaimer:</span> SG Lotto Results is an independent service and is not affiliated with or endorsed by Singapore Pools. This site is for information only; we do not sell tickets or operate gambling services. We accept no liability for errors. Please verify all results with official sources before claiming prizes.
                    </p>
                </div>
            </div>
        </footer>
    );
}
