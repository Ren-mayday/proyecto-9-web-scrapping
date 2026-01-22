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
  let unchangedCount = 0;
  let scrollCount = 0;
  const MAX_SCROLLS = 15; // Máximo 15 scrolls para evitar loops infinitos

  while (unchangedCount < 3 && scrollCount < MAX_SCROLLS) {
    scrollCount++;
    
    // Hacer scroll hacia abajo
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    
    // Esperar un momento para que carguen nuevos productos
    await wait(2000);

    const currentHeight = await page.evaluate(() => document.body.scrollHeight);
    
    if (currentHeight === previousHeight) {
      unchangedCount++;
      console.log(`Sin cambios en altura (${unchangedCount}/3) - Scroll ${scrollCount}/${MAX_SCROLLS}`);
    } else {
      unchangedCount = 0;
      console.log(`Nuevos productos cargados - Scroll ${scrollCount}/${MAX_SCROLLS}`);
    }
    
    previousHeight = currentHeight;
  }
  
  if (scrollCount >= MAX_SCROLLS) {
    console.log(`⚠️ Límite de scrolls alcanzado (${MAX_SCROLLS}), continuando con extracción...`);
  } else {
    console.log("✅ Fin del scroll infinito: no se cargan más productos");
  }
};

const scrap = async (url) => {
  const arrayEarings = [];
  
  console.log("Iniciando scrapper");

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      "--no-first-run", 
      "--no-default-browser-check", 
      "--disable-sync", 
      "--disable-features=ChromeWhatsNewUI"
    ],
  });

  const page = await browser.newPage();
  
  // Configurar timeout más largo 
  page.setDefaultTimeout(120000); // 2 minutos
  page.setDefaultNavigationTimeout(120000); // 2 minutos
  
  console.log("Navegando a la página...");
  
  try {
    // Intentar con domcontentloaded (más rápido)
    await page.goto(url, { 
      waitUntil: "domcontentloaded", 
      timeout: 120000 
    });
    console.log("✅ Página cargada (DOM ready)");
  } catch (error) {
    console.log("⚠️ Timeout en primera carga, reintentando...");
    // Reintentar con estrategia aún más permisiva
    await page.goto(url, { 
      waitUntil: "load", 
      timeout: 0  // Sin timeout
    });
  }
  
  console.log("Esperando elementos...");

  // Espera inicial para que cargue contenido dinámico
  await wait(5000);

  // Aceptar cookies
  try {
    await page.waitForSelector("#tinycookie-box, .tinycookie-button.tinycookie-accept-all", {
      timeout: 15000,
      visible: true,
    });
    await page.click(".tinycookie-button.tinycookie-accept-all");
    console.log("Banner de cookies aceptado");
    await wait(1000);
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
    await wait(1000);
  } catch (error) {
    console.log("No apareció el popup");
  }

  // IMPORTANTE: Esperar a que los productos se carguen ANTES del scroll
  console.log("Esperando a que se carguen los productos iniciales...");
  try {
    await page.waitForSelector(".product-card-wrapper", { 
      timeout: 15000,
      visible: true 
    });
    console.log("✅ Productos iniciales detectados");
  } catch (error) {
    console.log("❌ No se detectaron productos, intentando continuar...");
  }

  // Scroll de vuelta arriba para empezar desde el principio
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(2000);

  // Contar productos antes del scroll
  let initialCount = await page.$$eval(".product-card-wrapper", (elements) => elements.length);
  console.log(`Productos visibles antes del scroll: ${initialCount}`);

  // Scroll infinito para cargar todos los productos
  await autoScroll(page);

  // Scroll final hasta arriba para asegurar que todo está cargado
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(2000);

  // Obtener todos los productos cargados del DOM
  const arrayProducts = await page.$$(".product-card-wrapper");
  console.log(`\n📦 Total productos encontrados: ${arrayProducts.length}`);

  if (arrayProducts.length === 0) {
    console.log("⚠️  No se encontraron productos. Verifica los selectores CSS.");
    await browser.close();
    return;
  }

  for (let i = 0; i < arrayProducts.length; i++) {
    const productDiv = arrayProducts[i];
    console.log(`\n--- Producto ${i + 1}/${arrayProducts.length} ---`);

    // Obtener imagen
    let img = "https://via.placeholder.com/300x300?text=No+Image";
    try {
      img = await productDiv.$eval(".media.active img", (el) => el.src);
    } catch (error) {
      console.log("⚠️  No se pudo obtener la imagen");
    }

    // Obtener título
    let title = "Sin título";
    try {
      title = await productDiv.$eval(".card__heading.h5", (el) => el.textContent.trim());
    } catch (error) {
      console.log("⚠️  No se pudo obtener el título");
    }
    console.log("Título:", title);

    // Obtener subtítulo
    let subtitle = "Sin subtítulo";
    try {
      subtitle = await productDiv.$eval(".product-custom-labels .custom-label.active", (el) => el.textContent.trim());
    } catch (error) {
      // Subtitle es opcional
    }

    // Obtener precio
    let price = 0;
    try {
      const priceText = await productDiv.$eval(".price-item.price-item--regular", (el) => el.textContent.trim());
      const cleanPrice = priceText.replace(/€|\s/g, "").replace(",", ".");
      price = parseFloat(cleanPrice) || 0;
    } catch (error) {
      console.log("⚠️  No se pudo obtener el precio");
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
      console.log("✅ Guardado en DB");
    } catch (err) {
      console.log("❌ Error guardando en DB:", err.message);
    }
  }

  console.log(`\n🎉 Total productos recolectados: ${arrayEarings.length}`);

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

    // URL de la tienda a scrapear
    const url = "https://sansarushop.com/collections/pendientes";

    await scrap(url);
    
    console.log("\n🎉 Scrapping completado exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error en el scrapper:", error);
    process.exit(1);
  }
};

// Solo ejecutar main() si este archivo se ejecuta directamente
if (require.main === module) {
  main();
}

module.exports = { scrap };