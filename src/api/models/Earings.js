const mongoose = require("mongoose");

const earingsSchema = new mongoose.Schema(
  {
    img: {
      type: String,
      default: "https://via.placeholder.com/300x300?text=No+Image",
    },
    title: {
      type: String,
      default: "Sin título",
    },
    subtitle: {
      type: String,
      default: "Sin título",
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Earings = mongoose.model("Earings", earingsSchema, "earings");
module.exports = Earings;
