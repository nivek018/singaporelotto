"use client"

import { useState } from 'react';
import { Loader2, Calendar } from 'lucide-react';

export function ScraperForm() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleScrape = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const queryParams = new URLSearchParams();
            if (startDate) queryParams.append('startDate', startDate);
            if (endDate) queryParams.append('endDate', endDate);

            const res = await fetch(`/api/scrape?${queryParams.toString()}`);
            const json = await res.json();

            if (json.success) {
                setMessage('Scraping completed successfully!');
            } else {
                setMessage('Error: ' + json.message);
            }
        } catch (err) {
            setMessage('Failed to trigger scraper.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <Calendar className="w-5 h-5" />
                Scrape Results
            </h3>

            <form onSubmit={handleScrape} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Start Date (Optional)</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">End Date (Optional)</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 flex justify-center items-center transition-colors"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                    {startDate || endDate ? 'Scrape Date Range' : 'Scrape Latest Results'}
                </button>

                {message && (
                    <div className={`p-3 rounded text-sm ${message.includes('Error') || message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}
            </form>
            <p className="text-xs text-gray-500 mt-2">
                Note: Leaving dates empty will scrape the latest available result. Specifying a range will attempt to scrape all draws within that period.
            </p>
        </div>
    );
}
