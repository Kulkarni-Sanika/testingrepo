# Data Scraping Methods: Scroll, Pagination, & API Techniques.

This collection features three distinct scripts designed to extract data efficiently from websites.
## apiScraping.js
## Overview
This script extracts data from a specified JSON file, filters selected columns, & exports the filtered data to an Excel file. Script is useful for converting and cleaning JSON data into a more readable and organized Excel format for analysis.

## Requirements
- Node.js installed on your system.
- xlsx package for working with Excel files.
Install using following command:

```bash
  npm install xlsx
```
To gather the data to populate the JSON file, you can scrape the website by following these steps:
- Right-click on the webpage & select Inspect to open the developer tools.
- Navigate to the Network tab in the developer tools.
- Look for a request named GetProjectList.Click on it and from headers section copy the API endpoint URL.
- Paste the copied API endpoint URL into the URL section of ThunderClient or Postman.Ensure that the POST method is selected.
- In the Payload section of the developer tools, right-click on the JSON object {,...} and click Copy Object.
- Paste the copied object into the Body section of ThunderClient or Postman.
- Update the values of "PageNum" to 1 and "RecordPerPage" to 10000 to get all records.
- Click Send to retrieve the data.

## How to Use
## Step 1: Set up File & Configuration
- fileName: Update the variable with path to your JSON file.
- locationName: Modify the variable to specify the name of the location or the sheet in output Excel file.
- columns: Adjust the array to include the columns you want to extract from the JSON file.
## Step 2: Running the Script
- Save the script as .js file.
- Execute the script using following command:

```bash
  node filename.js
```

## Step 3: Output
The script creates an Excel file named after `locationName`, containing the desired columns data, and saves it in the current directory.

## buttonScraping.js
## Overview
This script extracts project details from a website with pagination (using "Next" or "Load More" buttons) and exports the data to a JSON file. It is optimized for parallel processing to enhance scraping efficiency.

## Requirements
- Node.js installed on your system.
- Playwright.
Install using following command:

```bash
  npm install playwright
```
## How to Use
## Step 1: Set up File & Configuration
- recordsToFetch: Set total number of records to scrape.
- URL: Set the target website's URL.
## Updating selectors:
- Right-click on the html element you want to scrape and click Inspect.
- Copy the element's selector & replace it in the script.
Refer example shown below:
```javascript
await page.waitForSelector('table.new-selector');

```
- Check the columns & update the code.
Refer example shown below:
```javascript
const data = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('table.new-selector tr'))
        .slice(1)
        .map(row => {
            const cells = row.querySelectorAll('td');
            return { Column1: cells[0]?.innerText, Column2: cells[1]?.innerText };
        });
});
```
- Navigate to nextbutton structure and Update the next button selector.
Refer example shown below:
```javascript
const nextButton = await page.$('.new-next-button');
```
## Step 2: Running the Script
- Clone the repository or copy the script file.
- Execute the script using following command:

```bash
  node filename.js
```

## Step 3: Output
The scraped data is saved in a scrapedData.json file.

## scrollScraping.js
## Overview
This script leverages Playwright to scrape project details from a website, managing infinite scrolling to fetch the required number of records.

## Requirements
- Node.js installed on your system.
- Playwright.
Install using following command:

```bash
  npm install playwright
```
## How to Use
## Step 1: Set up File & Configuration
Update the following variables in the script as needed:
- locationName: Name of the location to scrape.
- totalRecords: Number of records you want to fetch.
- delayBetweenScrolls: Time in milliseconds between each scroll action.
## Updating selectors:
- Right-click on Html Element you want to scrape and click Inspect.
- Copy element's selector & replace it in the script.
Refer example shown below:
```javascript
const cards = Array.from(document.querySelectorAll('.new-card-selector'));

```
- Check inner structure of html element & update code.
Refer example shown below:
```javascript
const newCards = cards.map(item => {
    return {
        projectname: item.querySelector('.new-project-name')?.innerText.trim() || 'N/A',
        priceRange: item.querySelector('.new-price-range')?.innerText.trim() || 'N/A',
        location: item.querySelector('.new-location')?.innerText.trim() || 'N/A',
    };
});
```

## Step 2: Running the Script
-  Clone the repository or copy the script file.
-  Execute the script using following command:

```bash
  node filename.js
```

## Step 3: Output
The script creates an Excel file named after location.


