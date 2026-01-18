const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const Earings = require("../api/models/Earings");
const { connectDB } = require("../config/db");

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
        { timeout: 5000 }, // si no aumenta en 5s, no hay más productos
      );
    } catch (error) {
      console.log("Fin del scroll infinito: no se cargan más productos");
      break;
    }

    previousHeight = await page.evaluate(() => document.body.scrollHeight);
  }
};

const scrap = async (url) => {
  // Array local (no global) - se reinicia cada vez
  const arrayEarings = [];

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
    let img = "https://via.placeholder.com/300x300?text=No+Image";
    try {
      img = await productDiv.$eval(".media.active img", (el) => el.src);
    } catch (error) {
      console.log("No se pudo obtener la imagen");
    }

    // Obtener título
    let title = "Sin título";
    try {
      title = await productDiv.$eval(".card__heading.h5", (el) => el.textContent.trim());
    } catch (error) {
      console.log("No se pudo obtener el título");
    }
    console.log("Título:", title);

    // Obtener subtítulo
    let subtitle = "Sin subtítulo";
    try {
      subtitle = await productDiv.$eval(".product-custom-labels .custom-label.active", (el) => el.textContent.trim());
    } catch (error) {
      console.log("No se pudo obtener el subtítulo principal");
    }

    // Obtener precio
    let price = 0;
    try {
      const priceText = await productDiv.$eval(".price-item.price-item--regular", (el) => el.textContent.trim());
      // Quitar símbolo € y espacios, luego reemplazar coma por punto
      const cleanPrice = priceText.replace(/€|\s/g, "").replace(",", ".");
      price = parseFloat(cleanPrice) || 0; // Convertir a número
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

    // Guardar en base de datos
    try {
      await Earings.create(earings);
      console.log("✅ Producto guardado en DB:", title);
    } catch (err) {
      console.log("❌ Error guardando en DB:", err.message);
    }
  }

  console.log("Total productos recolectados:", arrayEarings.length);

  // Escribir archivo JSON con manejo de errores
  await write(arrayEarings);

  await browser.close();
  console.log("Navegador cerrado");
};

const write = async (arrayEarings) => {
  try {
    await fs.writeFile("products.json", JSON.stringify(arrayEarings, null, 2));
    console.log("✅ Archivo products.json escrito correctamente");
  } catch (error) {
    console.error("❌ Error al escribir el archivo products.json:", error.message);
    throw error;
  }
};

// Función principal que conecta a DB y ejecuta el scrapper
const main = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    console.log("✅ Conectado a la base de datos");

    // URL de la tienda a scrapear
    const url = "https://sansarushop.com/collections/pendientes"; // Ajusta esta URL

    await scrap(url);

    console.log("🎉 Scrapping completado exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error en el scrapper:", error);
    process.exit(1);
  }
};

// Solo ejecutar main() si este archivo se ejecuta directamente
if (require.main === module) {
  main();
}

module.exports = { scrap };
