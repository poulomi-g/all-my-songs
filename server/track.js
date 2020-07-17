const puppeteer = require("puppeteer");

class WebScraper {
  constructor() {
    puppeteer.launch().then(browser => (this.browser = browser));
  }

  async refresh() {
    await this.close();
    this.browser = await puppeteer.launch();
  }

  async getTrackingInfo(TRACKING_NUM) {
    const page = await this.browser.newPage();

    await page.goto(
      "https://www.canadapost.ca/trackweb/en#/details/" + TRACKING_NUM,
      { waitUntil: "networkidle0" }
    );

    // Please refactor :(
    const deliveryProgress = await page.evaluate(() => {
      const tableRows = Array.from(
        document.querySelectorAll("#trackprogresstable > tbody > tr")
      );
      let recentDate;
      const cells = tableRows.map(row => Array.from(row.children));
      const content = cells.map(row => {
        const children = row.map(cell => Array.from(cell.children));

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

    page.close();

    return deliveryProgress;
  }
}

module.exports = { WebScraper };
