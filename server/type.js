const puppeteer = require("puppeteer");
require("dotenv").config();

const string =
  "energy equals mass * (multiplied by) the speed of light 2 (squared). The multiplication sign is usually left out, giving e is equal to mc 2 (squared).";
const text = [
  "E2 is equal to (m0c2)2 plus (pc)2",
  "where",
  "#1 E represents the energy of a particle",
  "#2 m0 represents the mass of the particle when it is not moving",
  "#3 p represents the momentum of the particle when it is moving",
  "#4 c represents the speed of light.",
];

const asyncForEach = async (array, callback) => {
  for (let i = 0; i < array.length; i++) await callback(array[i], i, array);
};

const main = async () => {
  const browser = await puppeteer.launch({ slowMo: 14 });
  const page = await browser.newPage();
  await page.goto("https://www.typingclub.com/login.html", {
    waitUntil: "networkidle0",
  });

  await page.type("#username", process.env.EMAIL);
  await page.type("#password", process.env.PASSWORD);
  await page.click("#login-with-password");

  await page.waitForNavigation({ waitUntil: "networkidle0" });
  await page.goto("https://www.typingclub.com/sportal/program-3/3270.play");
  const classSelect =
    "#root > div:nth-child(1) > div > div > div > div > a:nth-child(3)";
  await page.waitForSelector(classSelect);
  await page.click(classSelect);

  const navbar =
    "#root > div:nth-child(2) > div.typing-results.scrollable-results > div.bottom-nav-bar > div";
  const tryAgain =
    "#root > div:nth-child(2) > div.typing-results.scrollable-results > div.bottom-nav-bar > div > button.btn.navbar-goback.hoverable-button.default > span";

  async function type(num) {
    await page.waitForSelector("body > input[type=text]");
    await asyncForEach(text, async line => {
      await page.keyboard.type(line);
      await page.keyboard.press("Enter");
    });
    await page.waitFor(3000);
    await page.goto("https://www.typingclub.com/sportal/program-3/3270.play");
    if (num > 0) {
      await type(num - 1);
    }
  }
  const arr = new Array(100).fill(0);
  await asyncForEach(arr, async () => {
    await asyncForEach(arr, async () => {
      await type(100);
    });
  });
};

if (process.env.EMAIL != null) main();
else console.log("Must define email and password in .env file");
