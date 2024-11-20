const puppeteer = require('puppeteer');
const fs = require('fs'); // Import the file system module

const pagesToScrape = 236; // Total pages to scrape
const pagesPerBatch = 5; // Number of pages to scrape per batch
const maxRecords = 236; // Fetch  records
const delayBetweenPages = 1000; // Delay between each page in milliseconds

async function scrapePages(startPage, endPage) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();

    const allData = []; // Array to collect all scraped data

    try {
        for (let i = startPage; i <= endPage; i++) {
            const url = `https://www.magicbricks.com/new-projects-Greater-Noida?page=${i}`;

            console.log(`Scraping: ${url}`);

            await page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
            );

            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

            const data = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.mghome__prjblk__txtsec')).map(item => {
                    // Extract and split the price range
                    const pricerange = item.querySelector('.mghome__prjblk__price')?.innerText.trim() || 'N/A';
                    let minPrice = 'N/A', maxPrice = 'N/A';

                    if (pricerange.includes(' - ')) {
                        [minPrice, maxPrice] = pricerange.split(' - ');
                    }

                    return {
                        projectname: item.querySelector('.mghome__prjblk__prjname')?.innerText.trim() || 'N/A',
                        Min_Price: minPrice,
                        Max_Price: maxPrice,
                        location: item.querySelector('.mghome__prjblk__locname')?.innerText.trim() || 'N/A',
                        bhkType: item.querySelector('.mghome__prjblk__bhk')?.innerText.trim() || 'N/A',
                    };
                }).filter(item => item.projectname);
            });

            allData.push(...data);

            if (allData.length >= maxRecords) break;

            await new Promise(resolve => setTimeout(resolve, delayBetweenPages));
        }
    } catch (error) {
        console.error(`Error scraping pages ${startPage} to ${endPage}:`, error);
    } finally {
        await browser.close();
    }

    return allData;
}

async function main() {
    let allData = [];
    for (let i = 1; i <= pagesToScrape; i += pagesPerBatch) {
        const startPage = i;
        const endPage = Math.min(i + pagesPerBatch - 1, pagesToScrape);

        try {
            const batchData = await scrapePages(startPage, endPage);
            allData.push(...batchData);

            if (allData.length >= maxRecords) break;

        } catch (error) {
            console.error('Error in batch scraping:', error);
        }
    }

    allData = allData.slice(0, maxRecords);

    console.log(`Total records fetched: ${allData.length}`);

    fs.writeFileSync('scrapedData.json', JSON.stringify(allData, null, 2));

    console.log('Data has been saved to scrapedData.json');
}

main();
