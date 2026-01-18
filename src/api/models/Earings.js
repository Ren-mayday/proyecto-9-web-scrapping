const mongoose = require("mongoose");

const earingsSchema = new mongoose.Schema(
  {
    img: {
      type: String,
      required: false,
      default: "https://via.placeholder.com/300x300?text=No+Image",
    },
    title: {
      type: String,
      required: false,
      default: "Sin título",
    },
    subtitle: {
      type: String,
      required: false,
      default: "Sin título",
    },
    price: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Earings = mongoose.model("Earings", earingsSchema, "earings");
module.exports = Earings;
