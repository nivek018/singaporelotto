"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/encode/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push('/encode/dashboard');
            } else {
                const data = await res.json();
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Admin Login</h1>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Enter admin password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 flex justify-center items-center transition-colors"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                        Login
                    </button>
                </form>
            </div>
        </main>
    );
}
