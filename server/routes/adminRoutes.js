const express = require("express");
const router = express.Router();

const verificarToken = require("../middlewares/authMiddleware");
const soloAdmin = require("../middlewares/adminMiddleware");

const {
  listarUsuarios,
  actualizarUsuario,
  eliminarUsuario
} = require("../controllers/adminController");

const {
  listarPedidosAdmin,
  actualizarEstadoPedido
} = require("../controllers/adminPedidosController");

const {
  listarStock,
  reponerStock
} = require("../controllers/adminStockController");

router.use(verificarToken, soloAdmin);

router.get("/usuarios", listarUsuarios);
router.put("/usuarios/:id", actualizarUsuario);
router.delete("/usuarios/:id", eliminarUsuario);

router.get("/pedidos", listarPedidosAdmin);
router.put("/pedidos/:id/estado", actualizarEstadoPedido);

router.get("/stock", listarStock);
router.put("/stock/:id", reponerStock);

module.exports = router;