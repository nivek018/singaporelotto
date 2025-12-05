import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
    return (
        <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">SG</div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Lotto Results</h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                        <a href="/4d/today" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">4D</a>
                        <a href="/toto/today" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Toto</a>
                        <a href="/sweep/today" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Sweep</a>
                    </div>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 hidden md:block"></div>
                    <div className="flex items-center gap-4">
                        {/* Admin link removed as per request */}
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
}
