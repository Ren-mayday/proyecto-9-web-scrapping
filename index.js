const puppeteer = require("puppeteer");

const scrap = async (url) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--no-first-run", "--no-default-browser-check", "--disable-sync", "--disable-features=ChromeWhatsNewUI"],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // Aceptar cookies
  try {
    await page.waitForSelector(".tinycookie-box", { timeout: 5000, visible: true });
    await page.click(".tinycookie-button.tinycookie-accept-all");
  } catch (error) {
    console.error("No apareció el banner de cookies");
  }

  // Cerrar Popup
  try {
    await page.waitForSelector("svg.needsclick", { timeout: 8000, visible: true });
    await page.click("svg.needsclick");
    console.log("Popup cerrado ✅");
  } catch (error) {
    console.error("No apareció el popup");
  }
};

scrap("https://sansarushop.com/collections/pendientes");
