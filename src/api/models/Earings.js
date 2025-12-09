const mongoose = require("mongoose");

const earingsSchema = new mongoose.Schema(
  {
    img: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Earings = mongoose.model("Earings", earingsSchema, "earings");
module.exports = Earings;
