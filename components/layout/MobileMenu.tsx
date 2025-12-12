'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            {/* Hamburger Button - only visible on mobile */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle menu"
            >
                {isOpen ? (
                    <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                    <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
            </button>

            {/* Mobile Menu Overlay - Portal-like placement outside the button wrapper */}
            {isOpen && (
                <div
                    className="fixed inset-x-0 top-[65px] bottom-0 bg-white dark:bg-gray-900 z-[100] overflow-y-auto md:hidden"
                    style={{ height: 'calc(100vh - 65px)' }}
                >
                    <nav className="flex flex-col p-4 text-base font-medium">
                        <a
                            href="/"
                            className="py-3 px-4 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </a>
                        <a
                            href="/4d"
                            className="py-3 px-4 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            4D Results
                        </a>
                        <a
                            href="/toto"
                            className="py-3 px-4 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Toto Results
                        </a>
                        <a
                            href="/sweep"
                            className="py-3 px-4 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Singapore Sweep
                        </a>
                        <a
                            href="/schedule"
                            className="py-3 px-4 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Schedule
                        </a>
                        <a
                            href="/jackpot"
                            className="py-3 px-4 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Jackpot
                        </a>

                        {/* History Dropdown */}
                        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                            <button
                                onClick={() => setHistoryOpen(!historyOpen)}
                                className="w-full py-3 px-4 flex items-center justify-between text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <span>History</span>
                                {historyOpen ? (
                                    <ChevronUp className="w-5 h-5" />
                                ) : (
                                    <ChevronDown className="w-5 h-5" />
                                )}
                            </button>
                            {historyOpen && (
                                <div className="ml-4 mt-1 space-y-1">
                                    <a
                                        href="/4d/history"
                                        className="block py-2 px-4 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        4D History
                                    </a>
                                    <a
                                        href="/toto/history"
                                        className="block py-2 px-4 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Toto History
                                    </a>
                                    <a
                                        href="/sweep/history"
                                        className="block py-2 px-4 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        SG Sweep History
                                    </a>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
}
