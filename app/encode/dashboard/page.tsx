import { EncodeForm } from "@/components/admin/EncodeForm";
import { ScraperForm } from "@/components/admin/ScraperForm";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <a href="/" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Back to Home</a>
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 py-8">
                <ScraperForm />

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Manual Result Entry</h2>
                    <EncodeForm />
                </div>
            </div>
        </main>
    );
}
