const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const { listarResenas, crearResena } = require("../controllers/resenaController");

router.get("/:productoId", listarResenas);
router.post("/:productoId", verificarToken, crearResena);

module.exports = router;
