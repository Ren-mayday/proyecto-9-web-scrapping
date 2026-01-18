require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");
const earingsRoutes = require("./src/api/routes/earingsRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Rutas de CRUD
app.use("/api/v1/earings", earingsRoutes);

// ENDPOINT de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API de Pendientes (productos de San Saru) funcionando correctamente",
    endpoints: {
      earings: "/api/earings",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Servidor levantado en: http://localhost:${PORT}`);
});
