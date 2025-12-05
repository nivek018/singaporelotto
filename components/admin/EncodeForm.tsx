"use client"

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function EncodeForm() {
    const [password, setPassword] = useState('');
    const [type, setType] = useState<'4D' | 'Toto' | 'Sweep'>('4D');
    const [drawDate, setDrawDate] = useState('');
    const [drawNo, setDrawNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // 4D Fields
    const [fourDWinning, setFourDWinning] = useState(['', '', '']);
    const [fourDStarter, setFourDStarter] = useState(Array(10).fill(''));
    const [fourDConsolation, setFourDConsolation] = useState(Array(10).fill(''));

    // Toto Fields (Simplified for manual entry - just winning numbers + additional)
    const [totoWinning, setTotoWinning] = useState(Array(6).fill(''));
    const [totoAdditional, setTotoAdditional] = useState('');

    // Sweep Fields (Simplified - just top 3)
    const [sweepWinning, setSweepWinning] = useState(['', '', '']);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        let data: any = {};

        if (type === '4D') {
            data = {
                drawNo: Number(drawNo),
                drawDate: new Date(drawDate),
                winning: fourDWinning.map(Number),
                starter: fourDStarter.map(Number),
                consolation: fourDConsolation.map(Number),
            };
        } else if (type === 'Toto') {
            data = {
                drawNo: Number(drawNo),
                drawDate: new Date(drawDate),
                winning: totoWinning.map(Number),
                additional: Number(totoAdditional),
                winningShares: [], // Manual entry might skip shares details for now
            };
        } else if (type === 'Sweep') {
            data = {
                drawNo: Number(drawNo),
                drawDate: new Date(drawDate),
                winning: sweepWinning.map(Number),
                jackpot: [],
                lucky: [],
                gift: [],
                consolation: [],
                participation: [],
                twoD: [],
            };
        }

        try {
            const res = await fetch('/api/encode/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password,
                    type,
                    drawDate,
                    drawNo,
                    data
                }),
            });
            const json = await res.json();
            if (json.success) {
                setMessage('Saved successfully!');
            } else {
                setMessage('Error: ' + json.message);
            }
        } catch (err) {
            setMessage('Failed to save.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div>
                <label className="block text-sm font-medium mb-1">Admin Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                        value={type}
                        onChange={e => setType(e.target.value as any)}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    >
                        <option value="4D">4D</option>
                        <option value="Toto">Toto</option>
                        <option value="Sweep">Sweep</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Draw Date</label>
                    <input
                        type="date"
                        value={drawDate}
                        onChange={e => setDrawDate(e.target.value)}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Draw No</label>
                    <input
                        type="number"
                        value={drawNo}
                        onChange={e => setDrawNo(e.target.value)}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        required
                    />
                </div>
            </div>

            <div className="border-t pt-4 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Winning Numbers</h3>

                {type === '4D' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            {fourDWinning.map((val, i) => (
                                <div key={i}>
                                    <label className="text-xs text-gray-500">Prize {i + 1}</label>
                                    <input
                                        type="number"
                                        value={val}
                                        onChange={e => {
                                            const newArr = [...fourDWinning];
                                            newArr[i] = e.target.value;
                                            setFourDWinning(newArr);
                                        }}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        placeholder={`Prize ${i + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Starter Prizes (10)</label>
                            <div className="grid grid-cols-5 gap-2">
                                {fourDStarter.map((val, i) => (
                                    <input
                                        key={i}
                                        type="number"
                                        value={val}
                                        onChange={e => {
                                            const newArr = [...fourDStarter];
                                            newArr[i] = e.target.value;
                                            setFourDStarter(newArr);
                                        }}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Consolation Prizes (10)</label>
                            <div className="grid grid-cols-5 gap-2">
                                {fourDConsolation.map((val, i) => (
                                    <input
                                        key={i}
                                        type="number"
                                        value={val}
                                        onChange={e => {
                                            const newArr = [...fourDConsolation];
                                            newArr[i] = e.target.value;
                                            setFourDConsolation(newArr);
                                        }}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {type === 'Toto' && (
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {totoWinning.map((val, i) => (
                                <input
                                    key={i}
                                    type="number"
                                    value={val}
                                    onChange={e => {
                                        const newArr = [...totoWinning];
                                        newArr[i] = e.target.value;
                                        setTotoWinning(newArr);
                                    }}
                                    className="w-16 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-center"
                                    placeholder={`#${i + 1}`}
                                />
                            ))}
                            <div className="flex items-center gap-2 ml-4">
                                <span className="text-sm font-bold">+</span>
                                <input
                                    type="number"
                                    value={totoAdditional}
                                    onChange={e => setTotoAdditional(e.target.value)}
                                    className="w-16 p-2 border rounded border-yellow-500 dark:bg-gray-700 dark:border-yellow-500 text-center"
                                    placeholder="Add"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {type === 'Sweep' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            {sweepWinning.map((val, i) => (
                                <div key={i}>
                                    <label className="text-xs text-gray-500">Prize {i + 1}</label>
                                    <input
                                        type="number"
                                        value={val}
                                        onChange={e => {
                                            const newArr = [...sweepWinning];
                                            newArr[i] = e.target.value;
                                            setSweepWinning(newArr);
                                        }}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        placeholder={`Prize ${i + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 italic">Note: Only top 3 prizes supported for manual entry currently.</p>
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 flex justify-center items-center"
            >
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                Save Result
            </button>

            {message && (
                <div className={`p-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}
        </form>
    );
}
