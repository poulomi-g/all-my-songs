const puppeteer = require("puppeteer");

const TRACKING_NUM = "1023038647106760";

async function getTrackingInfo(TRACKING_NUM) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    "https://www.canadapost.ca/trackweb/en#/details/" + TRACKING_NUM,
    { waitUntil: "networkidle0" }
  );

  // await page.click("#showMoreLink");

  // Please refactor :(
  const deliveryProgress = await page.evaluate(() => {
    const tableRows = Array.from(
      document.querySelectorAll("#trackprogresstable > tbody > tr")
    );
    let recentDate;
    const cells = tableRows.map(row => Array.from(row.children));
    const content = cells.map(row => {
      const children = row.map(cell => Array.from(cell.children));

      console.log(children[1]);

      let date = children[0].length > 0 ? children[0][0].innerHTML : null;
      let time =
        children[1].length > 0 ? children[1][0].innerHTML.trim() : null;
      const description = children[2][0].innerText;
      const city = children[2][1].innerText
        .trim()
        .split(/\r?\n/)
        .map(i => i.trim())
        .join(" ");

      if (date != null) recentDate = date;
      else date = recentDate;

      const info =
        time != null ? { date, description, time } : { date, description };

      return city != "" ? { ...info, city } : info;
    });

    return content;
  });

  browser.close();

  return deliveryProgress;
}

module.exports = { getTrackingInfo };
