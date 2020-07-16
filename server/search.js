const puppeteer = require("puppeteer");

const TRACKING_NUM = "1023038647106760";
const args = process.argv.slice(2);
const headless = args[0] == "headless";

async function main() {
  const browser = await puppeteer.launch({ headless });
  const page = await browser.newPage();

  // this whole thing is unnecessary tbh we could just go to the link to the progress page itself
  // https://www.canadapost.ca/trackweb/en#/details/1023038647106760
  /*
  await page.goto("https://www.canadapost.ca/trackweb/en#/home");
  await page.focus("#input");
  await page.keyboard.type(TRACKING_NUM);
  await page.click("#submitButton");
  await page.waitForNavigation({ waitUntil: "networkidle0" });
  */

  await page.goto(
    "https://www.canadapost.ca/trackweb/en#/details/" + TRACKING_NUM,
    { waitUntil: "networkidle0" }
  );

  await page.click("#showMoreLink");

  const deliveryProgress = await page.evaluate(() => {
    const tableBody = document.querySelector("#trackprogresstable > tbody");
    const tableRows = Array.from(tableBody.children);
    const tableCells = tableRows.map(row => Array.from(row.children));
    const cellContent = tableCells.map(row =>
      row.map(cell => {
        const child = Array.from(cell.children)[0];
        return child != null ? child.innerHTML.trim() : "";
      })
    );
    return cellContent;
  });

  console.log(deliveryProgress);
}

main();
