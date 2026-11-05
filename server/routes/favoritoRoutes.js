const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const {
  listarFavoritos,
  agregarFavorito,
  quitarFavorito,
} = require("../controllers/favoritoController");

router.get("/", verificarToken, listarFavoritos);
router.post("/:productoId", verificarToken, agregarFavorito);
router.delete("/:productoId", verificarToken, quitarFavorito);

module.exports = router;