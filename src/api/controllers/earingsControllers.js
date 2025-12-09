const mongoose = require("mongoose");
const Earings = require("../models/Earings");

// GET - obtener todos los earings
const getEarings = async (req, res) => {
  try {
    const earings = await Earing.find();
    res.json(earings);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo pendients", error });
  }
};

// POST - crear nuevo earing
const createEaring = async (req, res) => {
  try {
    const newEaring = await Earing.create(req.body);
    res.json(newEaring);
  } catch (error) {
    res.status(500).json({ message: "Error creando earing", error });
  }
};

// PUT - actualizar un earing
const updateEaring = async (req, res) => {
  try {
    const updated = await Earing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error actualizando earing", error });
  }
};

// DELETE - eliminar un earing
const deleteEaring = async (req, res) => {
  try {
    await Earing.findByIdAndDelete(req.params.id);
    res.json({ message: "Earing eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando earing", error });
  }
};

module.exports = {
  getEarings,
  createEaring,
  updateEaring,
  deleteEaring,
};
