const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");

async function listarProductos(req, res) {
  try {
    const { categoria, search, page = 1, limit = 8 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = `WHERE Estado <> 'Inactivo'`;
    const replacements = { limit: Number(limit), offset };

    if (categoria && categoria !== "Todos") {
      whereClause += ` AND Categoria = :categoria`;
      replacements.categoria = categoria;
    }

    if (search && search.trim() !== "") {
      whereClause += ` AND (Nombre LIKE :search OR Descripcion LIKE :search)`;
      replacements.search = `%${search.trim()}%`;
    }

    const productos = await sequelize.query(
      `SELECT * FROM productos ${whereClause} ORDER BY Destacado DESC, ProductoID ASC LIMIT :limit OFFSET :offset`,
      { replacements, type: QueryTypes.SELECT }
    );

    const totalResult = await sequelize.query(
      `SELECT COUNT(*) as total FROM productos ${whereClause}`,
      { replacements, type: QueryTypes.SELECT }
    );

    return res.status(200).json({
      status: "ok",
      data: productos,
      pagination: { page: Number(page), limit: Number(limit), total: totalResult[0].total },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al obtener los productos" });
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
