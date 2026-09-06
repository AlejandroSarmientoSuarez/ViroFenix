const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");

async function listarProductos(req, res) {
  try {
    const productos = await sequelize.query(
      "SELECT * FROM vw_productos_disponibles ORDER BY Destacado DESC, ProductoID ASC",
      { type: QueryTypes.SELECT }
    );

    return res.status(200).json({
      status: "ok",
      data: productos,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener los productos",
    });
  }
}
async function obtenerProductoPorId(req, res) {
  try {
    const { id } = req.params;
    const producto = await sequelize.query(
      "SELECT * FROM productos WHERE ProductoID = :id LIMIT 1",
      { replacements: { id }, type: QueryTypes.SELECT }
    );

    if (producto.length === 0) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }

    return res.status(200).json({ status: "ok", data: producto[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al obtener el producto" });
  }
}

module.exports = { listarProductos, obtenerProductoPorId };
