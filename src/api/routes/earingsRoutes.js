const { getEarings, createEaring, updateEaring, deleteEaring } = require("../controllers/earingsControllers");

const earingsRoutes = require("express").Router();

earingsRoutes.get("/", getEarings);
earingsRoutes.post("/", createEaring);
earingsRoutes.put("/:id", updateEaring);
earingsRoutes.delete("/:id", deleteEaring);

module.exports = earingsRoutes;
