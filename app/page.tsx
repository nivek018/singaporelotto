import { ThemeToggle } from "@/components/ThemeToggle";
import { FourDResult } from "@/components/results/FourD";
import { TotoResult } from "@/components/results/Toto";
import { SweepResult } from "@/components/results/Sweep";
import pool from "@/lib/db";
import { FourDModel, TotoModel, SweepModel } from "@/lib/types";

async function getLatestResult(type: '4D' | 'Toto' | 'Sweep') {
  try {
    const [rows]: any = await pool.query(
      'SELECT data FROM results WHERE type = ? ORDER BY draw_date DESC LIMIT 1',
      [type]
    );
    if (rows.length > 0) {
      let data = rows[0].data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.error('Error parsing JSON data:', e);
          return null;
        }
      }
      return data;
    }
    return null;
  } catch (e) {
    console.error(`Error fetching ${type} result:`, e);
    return null;
  }
}

export const revalidate = 0; // Disable cache for now to see updates immediately

export default async function Home() {
  const fourD = await getLatestResult('4D') as FourDModel | null;
  const toto = await getLatestResult('Toto') as TotoModel | null;
  const sweep = await getLatestResult('Sweep') as SweepModel | null;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
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
              <a href="/admin/encode" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Admin</a>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Latest Results</h2>
          <p className="text-gray-500 dark:text-gray-400">Real-time lottery results for Singapore Pools</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-8">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  4D Results
                </h3>
                <a href="/4d/history" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View History &rarr;</a>
              </div>
              {fourD ? <FourDResult data={fourD} /> : <div className="text-center py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-xl shadow-sm">No 4D results found.</div>}
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Singapore Sweep
                </h3>
                <a href="/sweep/history" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View History &rarr;</a>
              </div>
              {sweep ? <SweepResult data={sweep} /> : <div className="text-center py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-xl shadow-sm">No Sweep results found.</div>}
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Toto Results
                </h3>
                <a href="/toto/history" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View History &rarr;</a>
              </div>
              {toto ? <TotoResult data={toto} /> : <div className="text-center py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-xl shadow-sm">No Toto results found.</div>}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
