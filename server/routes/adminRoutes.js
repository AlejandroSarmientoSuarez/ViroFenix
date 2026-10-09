const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const soloAdmin = require("../middlewares/adminMiddleware");
const {
  listarUsuarios,
  actualizarUsuario,
  eliminarUsuario,
} = require("../controllers/adminController");

// Todas las rutas de este archivo exigen sesión válida Y rol Admin
router.use(verificarToken, soloAdmin);

router.get("/usuarios", listarUsuarios);
router.put("/usuarios/:id", actualizarUsuario);
router.delete("/usuarios/:id", eliminarUsuario);

module.exports = router;