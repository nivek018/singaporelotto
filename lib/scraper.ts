import puppeteer, { Browser, Page } from 'puppeteer';
import { FourDModel, TotoModel, SweepModel, TotoPrizeShareModel } from './types';
import pool from './db';
import { log, cleanOldLogs } from './logger';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

// Helper to add delays
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
            { timeout: 10000 },
            selector,
            oldDrawNo
        );
        // Additional delay to ensure page is fully rendered
        await delay(500);
    } catch (e) {
        log('Timeout waiting for content update, continuing...', 'WARN');
    }
}

async function getDrawOptions(page: Page, selectSelector: string) {
    return await page.evaluate((selector) => {
        const select = document.querySelector(selector) as HTMLSelectElement;
        if (!select) return [];
        return Array.from(select.options).map(opt => ({
            value: opt.value,
            text: opt.text,
            date: new Date(opt.text)
        }));
    }, selectSelector);
}

async function scrape4D(browser: Browser, startDate?: Date, endDate?: Date): Promise<FourDModel[]> {
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    const results: FourDModel[] = [];

    try {
        log('Navigating to 4D results page...', 'INFO');
        await page.goto('http://www.singaporepools.com.sg/en/product/Pages/4d_results.aspx', { waitUntil: 'networkidle0' });

        const selectSelector = '.selectDrawList';
        let options = await getDrawOptions(page, selectSelector);
        log(`Found ${options.length} draw options for 4D.`, 'INFO');

        if (startDate && endDate) {
            options = options.filter(opt => {
                if (!opt.value) return false;
                const d = new Date(opt.text);
                return d >= startDate && d <= endDate;
            });
            log(`Filtered to ${options.length} options based on date range.`, 'INFO');
        } else {
            options = options.filter(opt => opt.value).slice(0, 1);
            log(`No date range specified, selecting latest draw: ${options[0]?.text}`, 'INFO');
        }

        for (const opt of options) {
            if (!opt) continue;

            try {
                // Wait for selector before reading
                await page.waitForSelector('.drawNumber', { timeout: 5000 });

                // Get current draw no to wait for change
                const currentDrawNoText = await page.$eval('.drawNumber', el => el.textContent?.trim() || '');
                const currentDrawNo = Number(currentDrawNoText.split(' ')[2]);

                if (options.length > 1) {
                    log(`Navigating to 4D draw: ${opt.text}`, 'INFO');
                    await page.select(selectSelector, opt.value);
                    await waitForContentUpdate(page, currentDrawNo, '.drawNumber');
                }

                const data = await page.evaluate(() => {
                    const items = Array.from(document.querySelectorAll('.tables-wrap'));
                    return items.map((item) => {
                        const drawNoText = item.querySelector('.drawNumber')?.textContent?.trim() || '';
                        const drawNo = Number(drawNoText.split(' ')[2]);
                        const rawDrawDate = item.querySelector('.drawDate')?.textContent?.trim() || '';
                        // Parse as Singapore time and extract just the date part (YYYY-MM-DD)
                        const dateObj = new Date(`${rawDrawDate} GMT+0800`);
                        const drawDate = dateObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Singapore' }); // YYYY-MM-DD format

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

                if (data[0] && data[0].drawNo) {
                    results.push(data[0] as FourDModel);
                    log(`Scraped 4D draw ${data[0].drawNo} (${data[0].drawDate})`, 'INFO');
                } else {
                    log(`Failed to extract data for 4D draw option ${opt.text}`, 'WARN');
                }
            } catch (drawError: any) {
                log(`Error scraping 4D draw ${opt.text}: ${drawError.message}`, 'WARN');
                // Continue to next draw
            }
        }

    } catch (e: any) {
        log(`Error scraping 4D: ${e.message}`, 'ERROR');
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
        log('Navigating to Toto results page...', 'INFO');
        await page.goto('http://www.singaporepools.com.sg/en/product/Pages/toto_results.aspx', { waitUntil: 'networkidle0' });

        const selectSelector = '.selectDrawList';
        let options = await getDrawOptions(page, selectSelector);
        log(`Found ${options.length} draw options for Toto.`, 'INFO');

        if (startDate && endDate) {
            options = options.filter(opt => {
                if (!opt.value) return false;
                const d = new Date(opt.text);
                return d >= startDate && d <= endDate;
            });
        } else {
            options = options.filter(opt => opt.value).slice(0, 1);
        }

        for (const opt of options) {
            if (!opt) continue;

            try {
                // Wait for selector before reading
                await page.waitForSelector('.drawNumber', { timeout: 5000 });

                const currentDrawNoText = await page.$eval('.drawNumber', el => el.textContent?.trim() || '');
                const currentDrawNo = Number(currentDrawNoText.split(' ')[2]);

                if (options.length > 1) {
                    log(`Navigating to Toto draw: ${opt.text}`, 'INFO');
                    await page.select(selectSelector, opt.value);
                    await waitForContentUpdate(page, currentDrawNo, '.drawNumber');
                }

                const data = await page.evaluate(() => {
                    const items = Array.from(document.querySelectorAll('.tables-wrap'));
                    return items.map((item) => {
                        const drawNoText = item.querySelector('.drawNumber')?.textContent?.trim() || '';
                        const drawNo = Number(drawNoText.split(' ')[2]);
                        const rawDrawDate = item.querySelector('.drawDate')?.textContent?.trim() || '';
                        const cleanDate = rawDrawDate.replace(/\s+/g, ' ').trim();
                        // Parse as Singapore time and extract just the date part (YYYY-MM-DD)
                        const dateObj = new Date(`${cleanDate} GMT+0800`);
                        const drawDate = dateObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Singapore' }); // YYYY-MM-DD format

                        const winning = [
                            Number(item.querySelector('.win1')?.textContent?.trim()),
                            Number(item.querySelector('.win2')?.textContent?.trim()),
                            Number(item.querySelector('.win3')?.textContent?.trim()),
                            Number(item.querySelector('.win4')?.textContent?.trim()),
                            Number(item.querySelector('.win5')?.textContent?.trim()),
                            Number(item.querySelector('.win6')?.textContent?.trim()),
                        ];
                        const additional = Number(item.querySelector('.additional')?.textContent?.trim());

                        // Extract jackpot amount from the header
                        const jackpotEl = item.querySelector('.jackpotPrize');
                        const jackpotText = jackpotEl?.textContent?.trim() || '';
                        const jackpotAmount = Number(jackpotText.replace(/[^0-9.]/g, ''));

                        const winningShares: { group: string; prizeAmount: number; count: number }[] = [];
                        const rows = item.querySelectorAll('.tableWinningShares tbody tr');
                        rows.forEach(row => {
                            const cols = row.querySelectorAll('td');
                            if (cols.length >= 3) {
                                const group = cols[0].textContent?.trim() || '';
                                let prizeAmount = Number(cols[1].textContent?.trim().replace(/[^\d.]/g, ''));
                                const count = Number(cols[2].textContent?.trim().replace(/[^\d.]/g, ''));

                                // Use extracted jackpot amount for Group 1 if table value is 0/missing
                                if (group.includes('Group 1') && (prizeAmount === 0 || isNaN(prizeAmount)) && jackpotAmount > 0) {
                                    prizeAmount = jackpotAmount;
                                }

                                winningShares.push({
                                    group,
                                    prizeAmount,
                                    count,
                                });
                            }
                        });

                        return { drawNo, drawDate, winning, additional, winningShares };
                    });
                });

                if (data[0] && data[0].drawNo) {
                    results.push(data[0] as TotoModel);
                    log(`Scraped Toto draw ${data[0].drawNo}`, 'INFO');
                } else {
                    log(`Failed to extract data for Toto draw option ${opt.text}`, 'WARN');
                }
            } catch (drawError: any) {
                log(`Error scraping Toto draw ${opt.text}: ${drawError.message}`, 'WARN');
                // Continue to next draw
            }
        }
    } catch (e: any) {
        log(`Error scraping Toto: ${e.message}`, 'ERROR');
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
        log('Navigating to Sweep results page...', 'INFO');
        await page.goto('http://www.singaporepools.com.sg/en/product/Pages/sweep_results.aspx', { waitUntil: 'networkidle0' });

        const selectSelector = '.selectDrawList';
        let options = await getDrawOptions(page, selectSelector);
        log(`Found ${options.length} draw options for Sweep.`, 'INFO');

        if (startDate && endDate) {
            options = options.filter(opt => {
                if (!opt.value) return false;
                const d = new Date(opt.text);
                return d >= startDate && d <= endDate;
            });
        } else {
            options = options.filter(opt => opt.value).slice(0, 1);
        }

        for (const opt of options) {
            if (!opt) continue;

            try {
                // Wait for selector before reading
                await page.waitForSelector('.drawNumber', { timeout: 5000 });

                const currentDrawNoText = await page.$eval('.drawNumber', el => el.textContent?.trim() || '');
                const currentDrawNo = Number(currentDrawNoText.split(' ')[2]);

                if (options.length > 1) {
                    log(`Navigating to Sweep draw: ${opt.text}`, 'INFO');
                    await page.select(selectSelector, opt.value);
                    await waitForContentUpdate(page, currentDrawNo, '.drawNumber');
                }

                const data = await page.evaluate(() => {
                    const items = Array.from(document.querySelectorAll('.tables-wrap'));
                    return items.map((item) => {
                        const drawNoText = item.querySelector('.drawNumber')?.textContent?.trim() || '';
                        const drawNo = Number(drawNoText.split(' ')[2]);
                        const rawDrawDate = item.querySelector('.drawDate')?.textContent?.trim() || '';
                        // Parse as Singapore time and extract just the date part (YYYY-MM-DD)
                        const dateObj = new Date(`${rawDrawDate} GMT+0800`);
                        const drawDate = dateObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Singapore' }); // YYYY-MM-DD format

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

                if (data[0] && data[0].drawNo) {
                    results.push(data[0] as SweepModel);
                    log(`Scraped Sweep draw ${data[0].drawNo}`, 'INFO');
                } else {
                    log(`Failed to extract data for Sweep draw option ${opt.text}`, 'WARN');
                }
            } catch (drawError: any) {
                log(`Error scraping Sweep draw ${opt.text}: ${drawError.message}`, 'WARN');
                // Continue to next draw
            }
        }
    } catch (e: any) {
        log(`Error scraping Sweep: ${e.message}`, 'ERROR');
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
                log(`Skipping manual entry for ${type} draw ${result.drawNo}`, 'INFO');
                return;
            }
            // Update
            await connection.query(
                'UPDATE results SET data = ?, draw_date = ?, updated_at = NOW() WHERE id = ?',
                [JSON.stringify(result), result.drawDate, rows[0].id]
            );
            log(`Updated ${type} draw ${result.drawNo}`, 'INFO');
        } else {
            // Insert
            await connection.query(
                'INSERT INTO results (type, draw_date, draw_number, data, source) VALUES (?, ?, ?, ?, ?)',
                [type, result.drawDate, result.drawNo, JSON.stringify(result), 'scrape']
            );
            log(`Inserted new ${type} draw ${result.drawNo}`, 'INFO');
        }
    } catch (e: any) {
        log(`Error saving ${type} result: ${e.message}`, 'ERROR');
    } finally {
        connection.release();
    }
}

export async function runScraper(startDate?: string, endDate?: string) {
    cleanOldLogs();
    log('Starting scraper run...', 'INFO');

    // Import cloudflare module
    const { purgeGameCache, purgeAllGameCaches } = await import('./cloudflare');

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    try {
        log('Starting 4D scrape...', 'INFO');
        const fourDResults = await scrape4D(browser, start, end);
        for (const res of fourDResults) {
            await saveResult('4D', res);
            await purgeGameCache('4D', res.drawDate);
        }

        log('Starting Toto scrape...', 'INFO');
        const totoResults = await scrapeToto(browser, start, end);
        for (const res of totoResults) {
            await saveResult('Toto', res);
            await purgeGameCache('Toto', res.drawDate);
        }

        log('Starting Sweep scrape...', 'INFO');
        const sweepResults = await scrapeSweep(browser, start, end);
        for (const res of sweepResults) {
            await saveResult('Sweep', res);
            await purgeGameCache('Sweep', res.drawDate);
        }

        const total = fourDResults.length + totoResults.length + sweepResults.length;
        log(`Scraping completed. Processed ${total} draws. Cloudflare cache purged.`, 'INFO');
        return { success: true, message: `Scraping completed. Processed ${total} draws.` };
    } catch (e: any) {
        log(`Scraper failed: ${e.message}`, 'ERROR');
        return { success: false, message: 'Scraping failed: ' + e.message };
    } finally {
        await browser.close();
    }
}
