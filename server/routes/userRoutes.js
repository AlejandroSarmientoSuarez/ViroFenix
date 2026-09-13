const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const { obtenerPerfil, actualizarPerfil, eliminarCuenta } = require("../controllers/userController");

router.get("/perfil", verificarToken, obtenerPerfil);
router.put("/perfil", verificarToken, actualizarPerfil);
router.delete("/cuenta", verificarToken, eliminarCuenta);

module.exports = router;