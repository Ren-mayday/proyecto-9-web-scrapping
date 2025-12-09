const puppeteer = require("puppeteer");
const fs = require("fs");
const Earing = require("../api/models/Earings");

const arrayEarings = [];

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

// Scroll infinito hasta que no se carguen más productos
const autoScroll = async (page) => {
  let previousHeight = await page.evaluate(() => document.body.scrollHeight);

  while (true) {
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");

    try {
      // Espera a que el scrollHeight aumente (nuevos productos cargados)
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`,
        { timeout: 5000 } // si no aumenta en 5s, no hay más productos
      );
    } catch (error) {
      console.log("Fin del scroll infinito: no se cargan más productos");
      break;
    }

    previousHeight = await page.evaluate(() => document.body.scrollHeight);
  }
};

const scrap = async (url) => {
  console.log("Iniciando scrapper");

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--no-first-run", "--no-default-browser-check", "--disable-sync", "--disable-features=ChromeWhatsNewUI"],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });

  // Espera inicial para que se carguen banners, scripts y popups
  await wait(10000);

  // Aceptar cookies
  try {
    await page.waitForSelector("#tinycookie-box, .tinycookie-button.tinycookie-accept-all", {
      timeout: 15000,
      visible: true,
    });
    await page.click(".tinycookie-button.tinycookie-accept-all");
    console.log("Banner de cookies aceptado");
  } catch (error) {
    console.log("No apareció el banner de cookies");
  }

  // Cerrar Popup
  try {
    await page.waitForSelector("svg.needsclick", {
      timeout: 10000,
      visible: true,
    });
    await page.click("svg.needsclick");
    console.log("Popup cerrado");
  } catch (error) {
    console.log("No apareció el popup");
  }

  // Scroll infinito para cargar todos los productos
  await autoScroll(page);

  // Obtener todos los productos cargados del DOM
  const arrayProducts = await page.$$(".product-card-wrapper");
  console.log("Productos encontrados: ", arrayProducts.length);

  for (const productDiv of arrayProducts) {
    // Obtener imágenes
    let img = "";
    try {
      img = await productDiv.$eval(".media.active img", (el) => el.src);
    } catch (error) {
      console.log("No se pudo obtener la imagen");
    }
    console.log(img);

    // Obtener título
    let title = "";
    try {
      title = await productDiv.$eval(".card__heading.h5", (el) => el.textContent.trim());
    } catch (error) {
      console.log("No se pudo obtener el título");
    }
    console.log("Título:", title);

    // Obtener subtítulo
    let subtitle = "";
    try {
      subtitle = await productDiv.$eval(".product-custom-labels .custom-label.active", (el) => el.textContent.trim());
    } catch (error) {
      console.log("No se pudo obtener el subtítulo principal");
    }
    console.log("Subtítulo principal:", subtitle);

    // Obtener precio
    let price = "";
    try {
      price = await productDiv.$eval(".price-item.price-item--regular", (el) => el.textContent.trim());
      price = Number(price.replace(/€|\s/g, "")); // Quito signo €
    } catch (error) {
      console.log("No se pudo obtener el precio");
    }
    console.log("Precio:", price);

    const earings = {
      img: img,
      title: title,
      subtitle: subtitle,
      price: price,
    };

    arrayEarings.push(earings);

    try {
      await Earing.create(earings);
      console.log("Producto guardado en DB:", title);
    } catch (err) {
      console.log("Error guardando en DB:", err);
    }
  }

  console.log("Total productos recolectados:", arrayEarings.length);

  write(arrayEarings);

  await browser.close();
  console.log("Navegador cerrado");
};

const write = (arrayEarings) => {
  fs.writeFile("products.json", JSON.stringify(arrayEarings), () => {
    console.log("Archivo escrito");
  });
};

module.exports = { scrap };
