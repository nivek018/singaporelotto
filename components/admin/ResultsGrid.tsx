"use client"

import { useState, useEffect } from 'react';
import { Loader2, Trash2, Edit, ChevronLeft, ChevronRight } from 'lucide-react';

interface Result {
    id: number;
    type: '4D' | 'Toto' | 'Sweep';
    draw_date: string;
    draw_number: string;
    source: string;
    data: any;
}

export function ResultsGrid() {
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<any>(null);

    const fetchResults = async (p: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/encode/results?page=${p}&limit=10`);
            const json = await res.json();
            if (json.data) {
                setResults(json.data);
                setTotalPages(json.pagination.totalPages);
            }
        } catch (error) {
            console.error('Failed to fetch results');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults(page);
    }, [page]);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this result?')) return;
        try {
            const res = await fetch(`/api/encode/results?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchResults(page);
            }
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const handleEdit = (result: Result) => {
        setEditingId(result.id);
        setEditData({
            id: result.id,
            type: result.type,
            drawDate: new Date(result.draw_date).toISOString().split('T')[0],
            drawNo: result.draw_number,
            data: result.data
        });
    };

    const saveEdit = async () => {
        try {
            const res = await fetch('/api/encode/results', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            });
            if (res.ok) {
                setEditingId(null);
                fetchResults(page);
            } else {
                alert('Failed to update');
            }
        } catch (error) {
            alert('Error updating');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Manage Results</h3>

            {loading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin" />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Draw No</th>
                                <th className="px-6 py-3">Source</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result) => (
                                <tr key={result.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    {editingId === result.id ? (
                                        <>
                                            <td className="px-6 py-4">{result.type}</td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="date"
                                                    value={editData.drawDate}
                                                    onChange={e => setEditData({ ...editData, drawDate: e.target.value })}
                                                    className="p-1 border rounded"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="text"
                                                    value={editData.drawNo}
                                                    onChange={e => setEditData({ ...editData, drawNo: e.target.value })}
                                                    className="p-1 border rounded w-20"
                                                />
                                            </td>
                                            <td className="px-6 py-4">{result.source}</td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <button onClick={saveEdit} className="text-green-600 hover:text-green-900 font-bold">Save</button>
                                                <button onClick={() => setEditingId(null)} className="text-gray-600 hover:text-gray-900">Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{result.type}</td>
                                            <td className="px-6 py-4">{new Date(result.draw_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">{result.draw_number}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs ${result.source === 'manual' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                    {result.source}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <button onClick={() => handleEdit(result)} className="text-blue-600 hover:text-blue-900">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(result.id)} className="text-red-600 hover:text-red-900">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm">Page {page} of {totalPages}</span>
                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
