const {
  getEarings,
  getEaringsById,
  createEarings,
  updateEarings,
  deleteEarings,
} = require("../controllers/earingsControllers");

const earingsRoutes = require("express").Router();

earingsRoutes.get("/", getEarings); // GET todos los earings
earingsRoutes.get("/:id", getEaringsById); // GET un earing por ID
earingsRoutes.post("/", createEarings); // POST crear earing
earingsRoutes.put("/:id", updateEarings); // PUT actualizar earing
earingsRoutes.delete("/:id", deleteEarings); // DELETE eliminar earing

module.exports = earingsRoutes;
