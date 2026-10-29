const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const {
  obtenerCarrito,
  agregarProducto,
  actualizarCantidad,
  eliminarProducto,
} = require("../controllers/cartController");

router.get("/", verificarToken, obtenerCarrito);
router.post("/:productoId", verificarToken, agregarProducto);
router.put("/:productoId", verificarToken, actualizarCantidad);
router.delete("/:productoId", verificarToken, eliminarProducto);

module.exports = router;