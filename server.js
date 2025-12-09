require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");
const earingsRoutes = require("./src/api/routes/earingsRoutes");
const { scrap } = require("./src/utils/scrapper");

const app = express();
connectDB();
app.use(express.json());

// Rutas de CRUD
app.use("/api/v1/earings", earingsRoutes);

// ENDPOINT para ejecutar scrapping manualmente
app.get("/api/v1/scrap", async (req, res) => {
  try {
    console.log("Ejecutando scrapper...");

    const url = "https://sansarushop.com/collections/pendientes";

    await scrap(url); // ejecuta scrapper

    res.status(200).json({ message: "Scrapping completado y guardado en DB" });
  } catch (error) {
    console.error("Error ejecutando el scrapper:", error);
    res.status(500).json({ message: "Error ejecutando el scrapper" });
  }
});
// --------------------------------------------

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor levantado en: http://localhost:${PORT}`);
});
