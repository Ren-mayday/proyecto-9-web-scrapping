# 🛍️ SansaruShop Scraper - Proyecto9 Web Scrapping

Web scraping project with Puppeteer that extracts information (data) from an online shop and stores it in MongoDB with CRUD.

---

## 📋 Description
This project executes web scraping from the SansaruShop to extract the products information (pendientes/earings) to store them on a BBDD in MongoDB and provide an API REST to manage them.

---

## ✨ Characteristics
- ✅ Web scapping with Puppeter.
- ✅ Automatic navigation and pagination (máximum of 15) because the website takes too long to load the products. Previous version with infinite scroll takes more than an hour to be completed.
- ✅ Management of modals and popus (cookies and newsletters).
- ✅ Data extraction: image, title, subtitle and price (with a default value).
- ✅ Storage in MongoDB.
- ✅ Generation of the products.json file. 
- ✅ API REST with complete CRUD.
- ✅ Error handling.
- ✅ Default values on model.

---

## 🔧 Tech Stack
- Node.js
- Express.js
- Puppeteer
- MongoDB / Mongoose
- dotenv

---

### 📦 Installation
1. Clone repository
```
git clone https://github.com/Ren-mayday/proyecto-9-web-scrapping.git
cd proyecto-9-web-scrapping
npm install
```

2. Install dependencies
```
npm install
```

3. Configurate environment variables
```
PORT=4000
DB_URL=mongodb+srv://{db_name:password@cluster...}
```

## 🚀 Executing
Initializing Scraper process:

```
npm run scrap
**Whay you should see on Terminal if it executes successfully**
✅ Base de datos conectada correctamente
Iniciando scapper
Navegando a la página...
✅ Página cargada (DOM ready)
Esperando elementos...
Banner de cookies aceptado
Popup cerrado
Esperando a que se carguen los productos iniciales...
✅ Productos iniciales detectados
Productos visibles antes del scroll: 48
Nuevos productos cargados - Scroll 1/15
Nuevos productos cargados - Scroll 2/15
Nuevos productos cargados - Scroll 3/15
Nuevos productos cargados - Scroll 4/15
Sin cambios en altura (1/3) - Scroll 5/15
Nuevos productos cargados - Scroll 6/15
Nuevos productos cargados - Scroll 7/15
Nuevos productos cargados - Scroll 8/15
Sin cambios en altura (1/3) - Scroll 9/15
Nuevos productos cargados - Scroll 10/15
Nuevos productos cargados - Scroll 11/15
Sin cambios en altura (1/3) - Scroll 12/15
Nuevos productos cargados - Scroll 13/15
Nuevos productos cargados - Scroll 14/15
Nuevos productos cargados - Scroll 15/15
ión...

📦 Total productos encontrados: 384

--- Producto 1/384 ---
Título: PENDIENTES ARAVINDA (16MM)
Precio: 36
✅ Guardado en DB

--- Producto 2/384 ---
Título: PENDIENTES ARAVINDA (16MM)
Precio: 44
✅ Guardado en DB
```

Execution steps sum up:
1. Connect to MongoDB.
2. Navigating through website products.
3. Automatic scroll to load all products.
4. Data extraction of each product.
5. Storing to database.
6. Generate products.json file.

## 📡 API Endpoints
´´´
      getAllEarings: "GET /api/v1/earings",
      getEaringById: "GET /api/v1/earings/:id",
      createEaring: "POST /api/v1/earings",
      updateEaring: "PUT /api/v1/earings/:id",
      deleteEaring: "DELETE /api/v1/earings/:id",
´´´

# Create a new product
´´´
http
POST /api/v1/earings
{
"img": "https//example.com/image.jpg",
"title": "Pendientes de plata",
"subtitle": "Elegantes",
"price": 29.99
}
´´´

# Update a product
´´´
http
PUT /api/v1/earings:id
{
"price": 24.99
}
´´´

# Delete a product
´´´
http
DELETE /api/v1/earings:id
´´´









