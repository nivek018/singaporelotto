import puppeteer, { Browser, Page } from 'puppeteer';
import { FourDModel, TotoModel, SweepModel, TotoPrizeShareModel } from './types';
import pool from './db';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

async function scrape4D(browser: Browser): Promise<FourDModel[]> {
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    try {
        await page.goto('http://www.singaporepools.com.sg/en/product/Pages/4d_results.aspx', { waitUntil: 'networkidle0' });

        const results = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.tables-wrap'));
            return items.map((item) => {
                const drawNoText = item.querySelector('.drawNumber')?.textContent?.trim() || '';
                const drawNo = Number(drawNoText.split(' ')[2]);
                const rawDrawDate = item.querySelector('.drawDate')?.textContent?.trim() || '';
                const drawDate = new Date(`${rawDrawDate} GMT+0800`).toISOString();

                const winning = [
                    Number(item.querySelector('.tdFirstPrize')?.textContent?.trim()),
                    Number(item.querySelector('.tdSecondPrize')?.textContent?.trim()),
                    Number(item.querySelector('.tdThirdPrize')?.textContent?.trim()),
                ];

                const starter = Array.from(item.querySelectorAll('.tbodyStarterPrizes td')).map(td => Number(td.textContent));
                const consolation = Array.from(item.querySelectorAll('.tbodyConsolationPrizes td')).map(td => Number(td.textContent));

                return { drawNo, drawDate, winning, starter, consolation };
            });
        });

        return results.map(r => ({ ...r, drawDate: new Date(r.drawDate) }));
    } catch (e) {
        console.error('Error scraping 4D:', e);
        return [];
    } finally {
        await page.close();
    }
}

async function scrapeToto(browser: Browser): Promise<TotoModel[]> {
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    try {
        await page.goto('http://www.singaporepools.com.sg/en/product/Pages/toto_results.aspx', { waitUntil: 'networkidle0' });

        const results = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.tables-wrap'));
            return items.map((item) => {
                const drawNoText = item.querySelector('.drawNumber')?.textContent?.trim() || '';
                const drawNo = Number(drawNoText.split(' ')[2]);
                const rawDrawDate = item.querySelector('.drawDate')?.textContent?.trim() || '';
                const drawDate = new Date(`${rawDrawDate} GMT+0800`).toISOString();

                const winning = [
                    Number(item.querySelector('.win1')?.textContent?.trim()),
                    Number(item.querySelector('.win2')?.textContent?.trim()),
                    Number(item.querySelector('.win3')?.textContent?.trim()),
                    Number(item.querySelector('.win4')?.textContent?.trim()),
                    Number(item.querySelector('.win5')?.textContent?.trim()),
                    Number(item.querySelector('.win6')?.textContent?.trim()),
                ];
                const additional = Number(item.querySelector('.additional')?.textContent?.trim());

                const winningShares: any[] = [];
                const rows = Array.from(item.querySelectorAll('.tableWinningShares tr')).slice(2);
                rows.forEach(row => {
                    const cols = row.querySelectorAll('td');
                    if (cols.length >= 3) {
                        winningShares.push({
                            group: cols[0].textContent?.trim(),
                            prizeAmount: Number(cols[1].textContent?.trim().replace(/[^\d.]/g, '')),
                            count: Number(cols[2].textContent?.trim().replace(/[^\d.]/g, '')),
                        });
                    }
                });

                return { drawNo, drawDate, winning, additional, winningShares };
            });
        });

        return results.map(r => ({ ...r, drawDate: new Date(r.drawDate) }));
    } catch (e) {
        console.error('Error scraping Toto:', e);
        return [];
    } finally {
        await page.close();
    }
}

async function scrapeSweep(browser: Browser): Promise<SweepModel[]> {
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    try {
        await page.goto('http://www.singaporepools.com.sg/en/product/Pages/sweep_results.aspx', { waitUntil: 'networkidle0' });

        const results = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.tables-wrap'));
            return items.map((item) => {
                const drawNoText = item.querySelector('.drawNumber')?.textContent?.trim() || '';
                const drawNo = Number(drawNoText.split(' ')[2]);
                const rawDrawDate = item.querySelector('.drawDate')?.textContent?.trim() || '';
                const drawDate = new Date(`${rawDrawDate} GMT+0800`).toISOString();

                const winning = [
                    Number(item.querySelector('.valueFirstPrize')?.textContent?.trim()),
                    Number(item.querySelector('.valueSecondPrize')?.textContent?.trim()),
                    Number(item.querySelector('.valueThirdPrize')?.textContent?.trim()),
                ];

                const getNumbers = (nodes: NodeListOf<Element>) => Array.from(nodes).map(n => Number(n.textContent));

                const jackpotLucky = item.querySelectorAll('.tbodyJackpot');
                const jackpot = jackpotLucky[0] ? getNumbers(jackpotLucky[0].querySelectorAll('td')) : [];
                const lucky = jackpotLucky[1] ? getNumbers(jackpotLucky[1].querySelectorAll('td')) : [];

                const prizes = item.querySelectorAll('.expandable-content');
                const gift = prizes[0] ? getNumbers(prizes[0].querySelectorAll('td')) : [];
                const consolation = prizes[1] ? getNumbers(prizes[1].querySelectorAll('td')) : [];
                const participation = prizes[2] ? getNumbers(prizes[2].querySelectorAll('td')) : [];
                const twoD = prizes[3] ? getNumbers(prizes[3].querySelectorAll('td')) : [];

                return { drawNo, drawDate, winning, jackpot, lucky, gift, consolation, participation, twoD };
            });
        });

        return results.map(r => ({ ...r, drawDate: new Date(r.drawDate) }));
    } catch (e) {
        console.error('Error scraping Sweep:', e);
        return [];
    } finally {
        await page.close();
    }
}

async function saveResult(type: '4D' | 'Toto' | 'Sweep', result: any) {
    const connection = await pool.getConnection();
    try {
        // Check if exists
        const [rows]: any = await connection.query(
            'SELECT id, source FROM results WHERE type = ? AND draw_number = ?',
            [type, result.drawNo]
        );

        if (rows.length > 0) {
            if (rows[0].source === 'manual') {
                console.log(`Skipping manual entry for ${type} draw ${result.drawNo}`);
                return;
            }
            // Update
            await connection.query(
                'UPDATE results SET data = ?, draw_date = ?, updated_at = NOW() WHERE id = ?',
                [JSON.stringify(result), result.drawDate, rows[0].id]
            );
        } else {
            // Insert
            await connection.query(
                'INSERT INTO results (type, draw_date, draw_number, data, source) VALUES (?, ?, ?, ?, ?)',
                [type, result.drawDate, result.drawNo, JSON.stringify(result), 'scrape']
            );
        }
    } finally {
        connection.release();
    }
}

export async function runScraper() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        const fourDResults = await scrape4D(browser);
        for (const res of fourDResults) await saveResult('4D', res);

        const totoResults = await scrapeToto(browser);
        for (const res of totoResults) await saveResult('Toto', res);

        const sweepResults = await scrapeSweep(browser);
        for (const res of sweepResults) await saveResult('Sweep', res);

        return { success: true, message: 'Scraping completed' };
    } catch (e) {
        console.error('Scraper failed:', e);
        return { success: false, message: 'Scraping failed' };
    } finally {
        await browser.close();
    }
}
