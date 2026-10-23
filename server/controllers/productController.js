
const Producto = require("../models/Producto");
const { Op } = require("sequelize");

// Lista los productos activos y permite filtrarlos por categoría o texto.
async function listarProductos(req, res) {
  try {
    const where = { Estado: { [Op.ne]: "Inactivo" } };

    if (req.query.categoria && req.query.categoria !== "Todos") {
      where.Categoria = req.query.categoria;
    }

    // Busca coincidencias en el nombre o la descripción del producto.
    if (req.query.search) {
      where[Op.or] = [
        { Nombre: { [Op.like]: "%" + req.query.search + "%" } },
        { Descripcion: { [Op.like]: "%" + req.query.search + "%" } }
      ];
    }

    const productos = await Producto.findAll({
      where: where,
      order: [["ProductoID", "ASC"]]
    });

    return res.json({ status: "ok", data: productos });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener productos" });
  }
}

// Busca un producto por su ID y devuelve sus datos si está activo.
async function obtenerProductoPorId(req, res) {
  try {
    const producto = await Producto.findByPk(req.params.id);

    if (!producto || producto.Estado === "Inactivo") {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    return res.json({ status: "ok", data: producto });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener producto" });
  }
}

module.exports = {
  listarProductos,
  obtenerProductoPorId
};
