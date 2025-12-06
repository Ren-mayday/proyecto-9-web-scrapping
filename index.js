const puppeteer = require("puppeteer");
const fs = require("fs");

const arrayEarings = [];

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const scrap = async (url) => {
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
      timeout: 15000, // 15 segundos
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

  const arrayProducts = await page.$$(".product-card-wrapper");
  console.log(arrayProducts.length);

  for (const productDiv of arrayProducts) {
    // Obtener imágenes
    let img = "";
    try {
      img = await productDiv.$eval(".media.active img", (el) => el.src);
    } catch (error) {
      console.log("No se pudo obtener la imagen");
    }
    console.log(img);

    // Obtener título de los productos
    let title = "";
    try {
      title = await productDiv.$eval(".card__heading.h5", (el) => el.textContent.trim());
    } catch (error) {
      console.log("No se pudo obtener el título");
    }
    console.log("Título:", title);

    // Obtener subtítulo de los productos
    let subtitle = "";
    try {
      subtitle = await productDiv.$eval(".product-custom-labels .custom-label.active", (el) => el.textContent.trim());
    } catch (error) {
      console.log("No se pudo obtener el subtítulo principal");
    }
    console.log("Subtítulo principal:", subtitle);

    // Obtener precio de los productos
    let price = "";
    try {
      price = await productDiv.$eval(".price-item.price-item--regular", (el) => el.textContent.trim());
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
  }

  write(arrayEarings);
};

const write = (arrayEarings) => {
  fs.writeFile("earings.json", JSON.stringify(arrayEarings), () => {
    console.log("Archivo escrito");
  });
};

scrap("https://sansarushop.com/collections/pendientes");
