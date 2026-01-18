const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Base de datos conectada correctamente");
  } catch (error) {
    console.log("❌ Error conectando a la base de datos:", error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
