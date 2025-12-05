import puppeteer, { Browser, Page } from 'puppeteer';
import { FourDModel, TotoModel, SweepModel, TotoPrizeShareModel } from './types';
import pool from './db';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

// Helper to wait for content update
async function waitForContentUpdate(page: Page, oldDrawNo: number, selector: string) {
    try {
        await page.waitForFunction(
            (selector, oldDrawNo) => {
                const el = document.querySelector(selector);
                const text = el?.textContent?.trim() || '';
                // 4D/Toto/Sweep draw number format usually contains the number at the end
                const newDrawNo = Number(text.split(' ').pop());
                return newDrawNo !== oldDrawNo && !isNaN(newDrawNo);
            },
            { timeout: 5000 },
            selector,
            oldDrawNo
        );
    } catch (e) {
        console.log('Timeout waiting for content update, continuing...');
    }
}

async function getDrawOptions(page: Page, selectSelector: string) {
    return await page.evaluate((selector) => {
        const select = document.querySelector(selector) as HTMLSelectElement;
        if (!select) return [];
        return Array.from(select.options).map(opt => ({
            value: opt.value,
            text: opt.text,
            date: new Date(opt.text) // Attempt to parse date from text like "Sun, 05 Dec 2021"
        }));
    }, selectSelector);
}

async function scrape4D(browser: Browser, startDate?: Date, endDate?: Date): Promise<FourDModel[]> {
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    const results: FourDModel[] = [];

    try {
        await page.goto('http://www.singaporepools.com.sg/en/product/Pages/4d_results.aspx', { waitUntil: 'networkidle0' });

        // Identify dropdown
        const selectSelector = 'select[name*="ddlDrawDate"]'; // Common pattern

        let options = await getDrawOptions(page, selectSelector);

        // Filter options if date range provided
        if (startDate && endDate) {
            options = options.filter(opt => {
                const d = new Date(opt.text); // Text format usually "Day, DD Mon YYYY"
                return d >= startDate && d <= endDate;
            });
        } else {
            // If no range, just take the first one (latest)
            options = [options[0]];
        }

        for (const opt of options) {
            if (!opt) continue;

            // Get current draw no to wait for change
            const currentDrawNoText = await page.$eval('.drawNumber', el => el.textContent?.trim() || '');
            const currentDrawNo = Number(currentDrawNoText.split(' ')[2]);

            if (options.length > 1) {
                console.log(`Navigating to 4D draw: ${opt.text}`);
                await page.select(selectSelector, opt.value);
                await waitForContentUpdate(page, currentDrawNo, '.drawNumber');
            }

            const data = await page.evaluate(() => {
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

            if (data[0]) results.push({ ...data[0], drawDate: new Date(data[0].drawDate) });
        }

    } catch (e) {
        console.error('Error scraping 4D:', e);
    } finally {
        await page.close();
    }
    return results;
}

async function scrapeToto(browser: Browser, startDate?: Date, endDate?: Date): Promise<TotoModel[]> {
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    const results: TotoModel[] = [];

    try {
        await page.goto('http://www.singaporepools.com.sg/en/product/Pages/toto_results.aspx', { waitUntil: 'networkidle0' });

        const selectSelector = 'select[name*="ddlDrawDate"]';
        let options = await getDrawOptions(page, selectSelector);

        if (startDate && endDate) {
            options = options.filter(opt => {
                const d = new Date(opt.text);
                return d >= startDate && d <= endDate;
            });
        } else {
            options = [options[0]];
        }

        for (const opt of options) {
            if (!opt) continue;

            const currentDrawNoText = await page.$eval('.drawNumber', el => el.textContent?.trim() || '');
            const currentDrawNo = Number(currentDrawNoText.split(' ')[2]);

            if (options.length > 1) {
                console.log(`Navigating to Toto draw: ${opt.text}`);
                await page.select(selectSelector, opt.value);
                await waitForContentUpdate(page, currentDrawNo, '.drawNumber');
            }

            const data = await page.evaluate(() => {
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
            if (data[0]) results.push({ ...data[0], drawDate: new Date(data[0].drawDate) });
        }
    } catch (e) {
        console.error('Error scraping Toto:', e);
    } finally {
        await page.close();
    }
    return results;
}

async function scrapeSweep(browser: Browser, startDate?: Date, endDate?: Date): Promise<SweepModel[]> {
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    const results: SweepModel[] = [];

    try {
        await page.goto('http://www.singaporepools.com.sg/en/product/Pages/sweep_results.aspx', { waitUntil: 'networkidle0' });

        const selectSelector = 'select[name*="ddlDrawDate"]';
        let options = await getDrawOptions(page, selectSelector);

        if (startDate && endDate) {
            options = options.filter(opt => {
                const d = new Date(opt.text);
                return d >= startDate && d <= endDate;
            });
        } else {
            options = [options[0]];
        }

        for (const opt of options) {
            if (!opt) continue;

            const currentDrawNoText = await page.$eval('.drawNumber', el => el.textContent?.trim() || '');
            const currentDrawNo = Number(currentDrawNoText.split(' ')[2]);

            if (options.length > 1) {
                console.log(`Navigating to Sweep draw: ${opt.text}`);
                await page.select(selectSelector, opt.value);
                await waitForContentUpdate(page, currentDrawNo, '.drawNumber');
            }

            const data = await page.evaluate(() => {
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
            if (data[0]) results.push({ ...data[0], drawDate: new Date(data[0].drawDate) });
        }
    } catch (e) {
        console.error('Error scraping Sweep:', e);
    } finally {
        await page.close();
    }
    return results;
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

export async function runScraper(startDate?: string, endDate?: string) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    try {
        console.log('Starting 4D scrape...');
        const fourDResults = await scrape4D(browser, start, end);
        for (const res of fourDResults) await saveResult('4D', res);

        console.log('Starting Toto scrape...');
        const totoResults = await scrapeToto(browser, start, end);
        for (const res of totoResults) await saveResult('Toto', res);

        console.log('Starting Sweep scrape...');
        const sweepResults = await scrapeSweep(browser, start, end);
        for (const res of sweepResults) await saveResult('Sweep', res);

        return { success: true, message: `Scraping completed. Processed ${fourDResults.length + totoResults.length + sweepResults.length} draws.` };
    } catch (e: any) {
        console.error('Scraper failed:', e);
        return { success: false, message: 'Scraping failed: ' + e.message };
    } finally {
        await browser.close();
    }
}
