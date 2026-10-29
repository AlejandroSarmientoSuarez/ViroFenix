const express = require("express");
const router = express.Router();
const {
  register,
  login,
  solicitarRecuperacion,
  restablecerPassword,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/recuperar", solicitarRecuperacion);
router.post("/restablecer", restablecerPassword);

module.exports = router;