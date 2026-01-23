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
