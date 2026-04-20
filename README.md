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

🎉 Total productos recolectados: 384 (example)
✅ Archivo products.json escrito correctamente
Navegador cerrado
```

Execution steps sum up:
1. Connect to MongoDB.
2. Navigating through website products.
3. Automatic scroll to load all products.
4. Data extraction of each product.
5. Storing to database.
6. Generate products.json file.

## Executing API Server
To initialize Express server:
```
npm start
# or development mode
npm run dev
```
Server available in ```http://localhost:4000```

## 📡 API Endpoints

| controllers | Method | Endpoint |
|---------------|--------|----------|
| getAllEarings | GET | /api/v1/earings |
| getEaringById | GET | /api/v1/earings/:id |
| createEaring | POST | /api/v1/earings" |
| updateEaring | PUT | /api/v1/earings/:id |
| deleteEaring | DELETE | /api/v1/earings/:id |

## Create a new product
```
http
POST /api/v1/earings
{
"img": "https//example.com/image.jpg",
"title": "Pendientes de plata",
"subtitle": "Elegantes",
"price": 29.99
}
```

## Update a product
```
http
PUT /api/v1/earings:id
{
"price": 24.99
}
```

## Delete a product
```
http
DELETE /api/v1/earings:id
```

## 🔧 Scripts
```
{
"start": "node server.js", // Starts server
"dev": "nodemon server.js", // Server development mode
"scrap": "node src/utils/scrapper.js" // Executes scrapper
}
```

## Data model
```
javascript
{
img: String, // img URL (by default: placeholder)
title: String, // Product title (by default: "Sin título")
subtitle: String, // Subtitle (by default: "Sin subtítulo")
price: Number, // Product price (by default: 0)
createdAt: Date, // Creation date (automatic)
updatedAt: Date // Update date (automatic)
}
```

---

## ⚠️
Sraper handles automatically the following:
- Cookies banners.
- Popups newsletter.
- Infinite scroll to load products.
- By default values in case it does not find a specific data.
Price conversion
- Removes € symbol
- Converts comas into decimal dots.
- Saves as a number on database.
## 🐛 Bugs. Problem solutions:
- Verify that MongoDB is executing.
- Review enviroment variables on .env.
- Make sure you have Chrome (Puppeteer use this browser).
## Error connecting to MongoDB
- Verify that DB_URL from .env is correct.
- Make sure that MongoDB is active.
## In case it does not found products:
- Website might changed HTML sturcture.
- Review selectors on scrapper.js
  
---

## 👩🏼‍💻 Author
Ren-mayday
- GitHub: https://github.com/Ren-mayday
- Repository: https://github.com/Ren-mayday/proyecto-9-web-scrapping

## Project developed as part of RockTheCode - ThePower Education alumni.




