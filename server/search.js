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

  // This works but it doesn't get the location of the parcel which is kinda useless
  const deliveryProgressNoLocation = await page.evaluate(() => {
    const tableRows = Array.from(
      document.querySelectorAll("#trackprogresstable > tbody > tr")
    );
    const cellContent = tableRows.map(row =>
      Array.from(row.children).map(cell => {
        const firstChild = cell.firstElementChild;
        return firstChild != null ? firstChild.innerHTML.trim() : "";
      })
    );

    return cellContent;
  });

  // UNDER CONSTRUCTION
  const deliveryProgress = await page.evaluate(() => {
    const tableRows = Array.from(
      document.querySelectorAll("#trackprogresstable > tbody > tr")
    );
    const cellContent = tableRows.map(row =>
      Array.from(row.children).map(cell => {
        const children = Array.from(cell.children);

        // all's good
        if (children.length <= 1)
          return children[0] ? children[0].innerHTML.trim() : "";

        // it's the dreaded third row
        const description = children[0].innerHTML;
        const city = Array.from(children[1].children)
          .map(el => el.innerHTML)
          .join(" ");

        return city != "" ? { description, city } : { description };
      })
    );

    return cellContent;
  });
  console.log(deliveryProgress);
  console.log(deliveryProgressNoLocation);
}

main();
