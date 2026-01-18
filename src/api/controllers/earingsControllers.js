const Earings = require("../models/Earings");

// GET - obtener todos los earings
const getEarings = async (req, res) => {
  try {
    const earings = await Earings.find();
    res.json(earings);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo pendients", error: error.message });
  }
};

// GET - obtener un earing por ID
const getEaringById = async (req, res) => {
  try {
    const earing = await Earings.findById(req.params.id);
    if (!earing) {
      return res.status(404).json({ message: "Earing no encontrado" });
    }
    res.json(earing);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo pendientes", error: error.message });
  }
};

// POST - crear nuevo earing
const createEaring = async (req, res) => {
  try {
    const newEaring = await Earings.create(req.body);
    res.status(201).json(newEaring);
  } catch (error) {
    res.status(500).json({ message: "Error creando pendientes", error: error.message });
  }
};

// PUT - actualizar un earing
const updateEaring = async (req, res) => {
  try {
    const updated = await Earing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ message: "Pendientes no encontrados" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error actualizando pendientes", error: error.message });
  }
};

// DELETE - eliminar un earing
const deleteEaring = async (req, res) => {
  try {
    const deleted = await Earings.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Pendientes no encontrados" });
    }
    res.json({ message: "Pendientes eliminados correctamente", deleted });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando pendientes", error: error.message });
  }
};

module.exports = {
  getEarings,
  getEaringById,
  createEaring,
  updateEaring,
  deleteEaring,
};
