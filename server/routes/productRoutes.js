const express = require("express");
const router = express.Router();
const { listarProductos, obtenerProductoPorId } = require("../controllers/productController");

router.get("/", listarProductos);
router.get("/:id", obtenerProductoPorId);

module.exports = router;