const puppeteer = require("puppeteer");
const Earing = require("../api/models/Earings"); // <--- IMPORTA EL MODELO
const fs = require("fs");

const arrayEarings = [];

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

// Scroll infinito hasta que no se carguen más productos
const autoScroll = async (page) => {
  let previousHeight = await page.evaluate(() => document.body.scrollHeight);

  while (true) {
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");

    try {
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`, { timeout: 5000 });
    } catch (error) {
      console.log("Fin del scroll infinito: no se cargan más productos");
      break;
    }

    previousHeight = await page.evaluate(() => document.body.scrollHeight);
  }
};

const scrap = async (url) => {
  console.log("Iniciando scrapper...");

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });

  await wait(10000);

  // Aceptar cookies
  try {
    await page.waitForSelector(".tinycookie-button.tinycookie-accept-all", { timeout: 15000 });
    await page.click(".tinycookie-button.tinycookie-accept-all");
  } catch {}

  // Scroll infinito
  await autoScroll(page);

  // Obtener productos
  const arrayProducts = await page.$$(".product-card-wrapper");
  console.log("Productos encontrados: ", arrayProducts.length);

  for (const productDiv of arrayProducts) {
    let img = "";
    let title = "";
    let subtitle = "";
    let price = "";

    try {
      img = await productDiv.$eval(".media.active img", (el) => el.src);
    } catch {}

    try {
      title = await productDiv.$eval(".card__heading.h5", (el) => el.textContent.trim());
    } catch {}

    try {
      subtitle = await productDiv.$eval(".product-custom-labels .custom-label.active", (el) => el.textContent.trim());
    } catch {}

    try {
      price = await productDiv.$eval(".price-item.price-item--regular", (el) => el.textContent.trim());
      price = Number(price.replace(/€|\s/g, ""));
    } catch {}

    const earings = { img, title, subtitle, price };
    arrayEarings.push(earings);

    // GUARDAR EN MONGO
    try {
      await Earing.create(earings);
      console.log("Producto guardado en DB:", title);
    } catch (err) {
      console.log("Error guardando en DB:", err);
    }
  }

  console.log("Total productos recolectados:", arrayEarings.length);

  await browser.close();
};

module.exports = { scrap };
