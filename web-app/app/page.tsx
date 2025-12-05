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
      return rows[0].data; // Already JSON parsed by mysql2 if configured, or need parsing? 
      // mysql2 returns JSON columns as objects usually.
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
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">SG Lotto Results</h1>
          <div className="flex items-center gap-4">
            <a href="/admin/encode" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Admin</a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <section>
            {fourD ? <FourDResult data={fourD} /> : <div className="text-center py-10 text-gray-500">No 4D results found.</div>}
          </section>

          <section>
            {toto ? <TotoResult data={toto} /> : <div className="text-center py-10 text-gray-500">No Toto results found.</div>}
          </section>

          <section>
            {sweep ? <SweepResult data={sweep} /> : <div className="text-center py-10 text-gray-500">No Sweep results found.</div>}
          </section>
        </div>
      </div>
    </main>
  );
}
