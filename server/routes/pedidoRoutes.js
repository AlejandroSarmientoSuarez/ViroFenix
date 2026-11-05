const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const { crearPedido, listarPedidos } = require("../controllers/pedidoController");

router.post("/", verificarToken, crearPedido);
router.get("/", verificarToken, listarPedidos);

module.exports = router;