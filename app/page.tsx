
import { FourDResult } from "@/components/results/FourD";
import { TotoResult } from "@/components/results/Toto";
import { SweepResult } from "@/components/results/Sweep";
import { CompactCountdown } from "@/components/countdown/CompactCountdown";
import pool from "@/lib/db";
import { FourDModel, TotoModel, SweepModel } from "@/lib/types";
import { getSchedule, getNextDrawDate, getTotoDrawTime } from "@/lib/schedule-utils";
import Link from "next/link";
import { ChevronRight, History } from "lucide-react";
import { PastDrawResults } from "@/components/PastDrawResults";
import { ResponsiveAd } from "@/components/ads/AdSense";

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

import { constructMetadata } from "@/lib/metadata";

export const revalidate = 0;

export const metadata = constructMetadata({
  path: "/",
});

export default async function Home() {
  const fourD = await getLatestResult('4D') as FourDModel | null;
  const toto = await getLatestResult('Toto') as TotoModel | null;
  const sweep = await getLatestResult('Sweep') as SweepModel | null;

  // Get schedules for countdown
  const schedule4D = await getSchedule('4D');
  const scheduleToto = await getSchedule('Toto');
  const scheduleSweep = await getSchedule('Sweep');

  const nextDraw4D = schedule4D ? getNextDrawDate(schedule4D) : new Date();
  const nextDrawToto = scheduleToto ? getNextDrawDate(scheduleToto) : new Date();
  const nextDrawSweep = scheduleSweep ? getNextDrawDate(scheduleSweep) : new Date();

  // Get TOTO cascade status for dynamic draw time
  const totoDrawTimeInfo = await getTotoDrawTime();

  // Server time for countdown offset calculation (Cloudflare cache-safe)
  const serverTime = new Date().toISOString();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Singapore Lotto Results
          </h1>
          <p className="text-lg text-blue-100 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Singapore Pools conducts three (3) major lottery games in Singapore: <a href="/4d" className="text-white underline hover:text-yellow-300">4D</a>, <a href="/toto" className="text-white underline hover:text-yellow-300">TOTO</a>, and the <a href="/sweep" className="text-white underline hover:text-yellow-300">Singapore Sweep</a>. Check here for the latest 4D result, TOTO result, and Singapore Sweep result. We provide real-time updates for every Wednesday, Saturday, and Sunday draw, along with the latest <a href="/jackpot" className="text-white underline hover:text-yellow-300">jackpot prize</a> estimates.
          </p>
        </div>
      </section>

      {/* Ad below hero */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <ResponsiveAd />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Latest Results</h2>
          <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full text-sm">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="6" />
            </svg>
            <span className="text-gray-600 dark:text-gray-400">
              Last updated: {(() => {
                const dates = [
                  fourD?.drawDate,
                  toto?.drawDate,
                  sweep?.drawDate
                ].filter(Boolean).map(d => new Date(d as string));
                const mostRecent = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date();
                return mostRecent.toLocaleDateString('en-SG', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });
              })()}
            </span>
          </div>
        </div>

        <div className="space-y-8">
          {/* Toto Section */}
          <section>
            {toto ? (
              <div className="rounded-xl overflow-hidden shadow-xl">
                <TotoResult
                  data={toto}
                  countdown={scheduleToto && (
                    <CompactCountdown
                      nextDrawDate={nextDrawToto.toISOString()}
                      drawTime={totoDrawTimeInfo.isCascade ? `${totoDrawTimeInfo.drawTime.replace(':', ':')} PM` : scheduleToto.draw_time}
                      gameType="Toto"
                      serverTime={serverTime}
                      isCascade={totoDrawTimeInfo.isCascade}
                    />
                  )}
                />
                {/* Links Footer */}
                <div className="bg-blue-50 dark:bg-gray-800 border-t-2 border-blue-400 dark:border-blue-600 px-4 py-3 sm:px-5 sm:py-4">
                  <div className="flex justify-between items-center gap-2">
                    <Link href="/toto" className="flex-1 sm:flex-none text-center sm:text-left py-2 px-3 sm:px-0 sm:py-0 bg-blue-500 sm:bg-transparent rounded-lg sm:rounded-none text-xs sm:text-sm font-semibold sm:font-medium text-white sm:text-blue-700 dark:text-white sm:dark:text-blue-400 hover:bg-blue-600 sm:hover:bg-transparent hover:text-white sm:hover:text-blue-900 dark:hover:text-blue-300 flex items-center justify-center sm:justify-start gap-1.5 transition-colors">
                      <ChevronRight className="w-4 h-4 hidden sm:block" />
                      <span className="sm:hidden">View Page</span>
                      <span className="hidden sm:inline">View Toto Results Page</span>
                    </Link>
                    <Link href="/toto/history" className="flex-1 sm:flex-none text-center sm:text-left py-2 px-3 sm:px-0 sm:py-0 bg-gray-600 sm:bg-transparent dark:bg-gray-600 sm:dark:bg-transparent rounded-lg sm:rounded-none text-xs sm:text-sm font-semibold sm:font-normal text-white sm:text-gray-600 dark:text-white sm:dark:text-gray-400 hover:bg-gray-700 sm:hover:bg-transparent hover:text-white sm:hover:text-blue-700 dark:hover:text-blue-400 flex items-center justify-center sm:justify-start gap-1.5 transition-colors">
                      <History className="w-4 h-4" />
                      <span className="sm:hidden">History</span>
                      <span className="hidden sm:inline">Toto Results History</span>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-xl shadow-sm">No Toto results found.</div>
            )}
          </section>

          {/* 4D Section */}
          <section>
            {fourD ? (
              <div className="rounded-xl overflow-hidden shadow-xl">
                <FourDResult
                  data={fourD}
                  countdown={schedule4D && (
                    <CompactCountdown
                      nextDrawDate={nextDraw4D.toISOString()}
                      drawTime={schedule4D.draw_time}
                      gameType="4D"
                      serverTime={serverTime}
                    />
                  )}
                />
                {/* Links Footer */}
                <div className="bg-yellow-50 dark:bg-gray-800 border-t-2 border-yellow-400 dark:border-yellow-600 px-4 py-3 sm:px-5 sm:py-4">
                  <div className="flex justify-between items-center gap-2">
                    <Link href="/4d" className="flex-1 sm:flex-none text-center sm:text-left py-2 px-3 sm:px-0 sm:py-0 bg-yellow-500 sm:bg-transparent rounded-lg sm:rounded-none text-xs sm:text-sm font-semibold sm:font-medium text-white sm:text-yellow-700 dark:text-white sm:dark:text-yellow-400 hover:bg-yellow-600 sm:hover:bg-transparent hover:text-white sm:hover:text-yellow-900 dark:hover:text-yellow-300 flex items-center justify-center sm:justify-start gap-1.5 transition-colors">
                      <ChevronRight className="w-4 h-4 hidden sm:block" />
                      <span className="sm:hidden">View Page</span>
                      <span className="hidden sm:inline">View 4D Results Page</span>
                    </Link>
                    <Link href="/4d/history" className="flex-1 sm:flex-none text-center sm:text-left py-2 px-3 sm:px-0 sm:py-0 bg-gray-600 sm:bg-transparent dark:bg-gray-600 sm:dark:bg-transparent rounded-lg sm:rounded-none text-xs sm:text-sm font-semibold sm:font-normal text-white sm:text-gray-600 dark:text-white sm:dark:text-gray-400 hover:bg-gray-700 sm:hover:bg-transparent hover:text-white sm:hover:text-yellow-700 dark:hover:text-yellow-400 flex items-center justify-center sm:justify-start gap-1.5 transition-colors">
                      <History className="w-4 h-4" />
                      <span className="sm:hidden">History</span>
                      <span className="hidden sm:inline">4D Results History</span>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-xl shadow-sm">No 4D results found.</div>
            )}
          </section>

          {/* Ad above Sweep */}
          <ResponsiveAd />

          {/* Sweep Section */}
          <section>
            {sweep ? (
              <div className="rounded-xl overflow-hidden shadow-xl">
                <SweepResult
                  data={sweep}
                  countdown={scheduleSweep && (
                    <CompactCountdown
                      nextDrawDate={nextDrawSweep.toISOString()}
                      drawTime={scheduleSweep.draw_time}
                      gameType="Sweep"
                      serverTime={serverTime}
                    />
                  )}
                />
                {/* Links Footer */}
                <div className="bg-green-50 dark:bg-gray-800 border-t-2 border-green-400 dark:border-green-600 px-4 py-3 sm:px-5 sm:py-4">
                  <div className="flex justify-between items-center gap-2">
                    <Link href="/sweep" className="flex-1 sm:flex-none text-center sm:text-left py-2 px-3 sm:px-0 sm:py-0 bg-green-500 sm:bg-transparent rounded-lg sm:rounded-none text-xs sm:text-sm font-semibold sm:font-medium text-white sm:text-green-700 dark:text-white sm:dark:text-green-400 hover:bg-green-600 sm:hover:bg-transparent hover:text-white sm:hover:text-green-900 dark:hover:text-green-300 flex items-center justify-center sm:justify-start gap-1.5 transition-colors">
                      <ChevronRight className="w-4 h-4 hidden sm:block" />
                      <span className="sm:hidden">View Page</span>
                      <span className="hidden sm:inline">View SG Sweep Results Page</span>
                    </Link>
                    <Link href="/sweep/history" className="flex-1 sm:flex-none text-center sm:text-left py-2 px-3 sm:px-0 sm:py-0 bg-gray-600 sm:bg-transparent dark:bg-gray-600 sm:dark:bg-transparent rounded-lg sm:rounded-none text-xs sm:text-sm font-semibold sm:font-normal text-white sm:text-gray-600 dark:text-white sm:dark:text-gray-400 hover:bg-gray-700 sm:hover:bg-transparent hover:text-white sm:hover:text-green-700 dark:hover:text-green-400 flex items-center justify-center sm:justify-start gap-1.5 transition-colors">
                      <History className="w-4 h-4" />
                      <span className="sm:hidden">History</span>
                      <span className="hidden sm:inline">SG Sweep Results History</span>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-xl shadow-sm">No Sweep results found.</div>
            )}
          </section>
        </div>

        {/* Weekly Draw Schedule Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Weekly Draw Schedule</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Game</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Draw Days</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Draw Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">
                    <Link href="/toto" className="hover:underline">TOTO</Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Monday & Thursday</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">6:30 PM (or 9:30 PM)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-yellow-600 dark:text-yellow-400">
                    <Link href="/4d" className="hover:underline">4D</Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Wednesday, Saturday, Sunday</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">6:30 PM</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-green-600 dark:text-green-400">
                    <Link href="/sweep" className="hover:underline">Singapore Sweep</Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">1st Wednesday of the Month</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">6:30 PM</td>
                </tr>
              </tbody>
            </table>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-500 dark:text-gray-400">
              * Draw times may change during special event draws or cascade draws. View the full <Link href="/schedule" className="text-blue-600 dark:text-blue-400 hover:underline">draw schedule</Link>.
            </div>
          </div>
        </section>

        {/* How to Claim Your Prize Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Claim Your Winnings</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Did you win? Congratulations! Here is a quick guide on where to claim your prize based on the amount won:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Prizes up to $5,000:</span>
                  <span className="text-gray-700 dark:text-gray-300"> Can be claimed in cash at any Singapore Pools outlet.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Prizes above $5,000:</span>
                  <span className="text-gray-700 dark:text-gray-300"> Must be claimed via cheque at the Singapore Pools Main Branch (210 Middle Road).</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Validity Period:</span>
                  <span className="text-gray-700 dark:text-gray-300"> All winning tickets are valid for 180 days from the draw date. Unclaimed prizes after this period are donated to charity.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ad above FAQs */}
        <ResponsiveAd className="mt-8" />

        {/* FAQ Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
            <div className="p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What time are the results released?</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Official draws typically take place at 6:30 PM SGT. Results are updated on this site immediately after the numbers are confirmed, usually between 6:35 PM and 6:45 PM. For Cascade Draws (TOTO), results may be released later at 9:30 PM.
              </p>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Is there a minimum age to play?</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Yes. You must be at least 21 years old to buy lottery tickets or claim prizes in Singapore.
              </p>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What is the difference between 4D Big and Small?</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                A "Big" bet covers all prize categories (1st, 2nd, 3rd, Starter, and Consolation), giving you a higher chance of winning. A "Small" bet only pays out for the top three prizes (1st, 2nd, and 3rd), but offers significantly higher winning amounts.
              </p>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Where can I buy lottery tickets in Singapore?</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Lottery tickets can be purchased at any authorized Singapore Pools outlet located island-wide, including those in shopping malls, HDB estates, and MRT stations. You can also buy tickets online through the official Singapore Pools website or mobile app after registering for an account.
              </p>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Are lottery winnings taxable in Singapore?</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                No. Lottery winnings in Singapore are not subject to income tax. All prizes are paid out in full without any tax deductions, making Singapore one of the most attractive places for lottery winners.
              </p>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What happens if I lose my winning ticket?</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Unfortunately, lottery tickets are bearer instruments, meaning whoever holds the ticket can claim the prize. If you lose a winning ticket, there is generally no way to recover the prize. Always sign the back of your ticket and keep it in a safe place.
              </p>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Can foreigners buy and claim lottery prizes?</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Yes. Foreigners who are physically present in Singapore and are at least 21 years old can purchase lottery tickets and claim prizes. There are no citizenship or residency requirements to participate in Singapore Pools games.
              </p>
            </div>
          </div>
        </section>

        {/* Responsible Gaming Notice */}
        <section className="mt-12 mb-4">
          <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Play Responsibly</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Lottery games are a form of entertainment and should be played responsibly. Do not bet money you cannot afford to lose. If you or someone you know has a gambling problem, please seek help from the National Council on Problem Gambling (NCPG) at <a href="https://www.ncpg.org.sg" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">www.ncpg.org.sg</a> or call the helpline at 1800-6-668-668.
            </p>
          </div>
        </section>
      </div>

      {/* Ad above Past Draw Results */}
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <ResponsiveAd />
      </div>

      {/* Past Draw Results */}
      <PastDrawResults />
    </main>
  );
}
