const {
  getEarings,
  getEaringById,
  createEaring,
  updateEaring,
  deleteEaring,
} = require("../controllers/earingsControllers");

const earingsRoutes = require("express").Router();

earingsRoutes.get("/", getEarings); // GET todos los earings
earingsRoutes.get("/:id", getEaringById); // GET un earing por ID
earingsRoutes.post("/", createEaring); // POST crear earing
earingsRoutes.put("/:id", updateEaring); // PUT actualizar earing
earingsRoutes.delete("/:id", deleteEaring); // DELETE eliminar earing

module.exports = earingsRoutes;
