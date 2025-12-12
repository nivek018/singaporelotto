'use client';

import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Navbar() {
    return (
        <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <a href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">SG</div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Lotto Results</h1>
                </a>
                <div className="flex items-center gap-4">
                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                        <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</a>
                        <a href="/4d" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">4D</a>
                        <a href="/toto" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Toto</a>
                        <a href="/sweep" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Sweep</a>
                        <a href="/schedule" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Schedule</a>
                        <div className="relative group">
                            <button className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                History
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
                            </button>
                            <div className="absolute top-full left-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                                <a href="/4d/history" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400">4D History</a>
                                <a href="/toto/history" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400">Toto History</a>
                                <a href="/sweep/history" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400">SG Sweep History</a>
                            </div>
                        </div>
                        <a href="/jackpot" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Jackpot</a>
                    </div>
                    {/* Theme Toggle - Desktop */}
                    <div className="hidden md:block">
                        <ThemeToggle />
                    </div>
                    {/* Mobile: Theme Toggle and Menu */}
                    <div className="flex md:hidden items-center gap-2">
                        <ThemeToggle />
                        <MobileMenu />
                    </div>
                </div>
            </div>
        </nav>
    );
}
