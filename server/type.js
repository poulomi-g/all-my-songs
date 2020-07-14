const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 13 });
  const page = await browser.newPage();
  await page.goto("https://www.typingclub.com/sportal/program-3/399.play");

  await page.waitForNavigation({ waitUntil: "networkidle0" });
  await page.waitForSelector("body > input[type=text]");
  const string =
    "energy equals mass * (multiplied by) the speed of light 2 (squared). The multiplication sign is usually left out, giving e is equal to mc 2 (squared).";
  await page.keyboard.type(string);
})();
