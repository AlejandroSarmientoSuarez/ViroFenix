
const Producto = require("../models/Producto");

// LISTAR PRODUCTOS
async function listarProductos(req, res) {
  try {
    const productos = await Producto.findAll({
      order: [["ProductoID", "ASC"]]
    });

    const resultado = [];

    for (let i = 0; i < productos.length; i++) {
      const producto = productos[i];

      if (producto.Estado === "Inactivo") {
        continue;
      }

      if (
        req.query.categoria &&
        req.query.categoria !== "Todos" &&
        producto.Categoria !== req.query.categoria
      ) {
        continue;
      }

      if (req.query.search) {
        const texto = req.query.search.toLowerCase();

        const nombre = producto.Nombre.toLowerCase();
        const descripcion = (producto.Descripcion || "").toLowerCase();

        if (!nombre.includes(texto) && !descripcion.includes(texto)) {
          continue;
        }
      }

      resultado.push(producto);
    }

    res.json({ status: "ok", data: resultado });

  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
}

// BUSCAR PRODUCTO POR ID
async function obtenerProductoPorId(req, res) {
  try {
    const producto = await Producto.findByPk(req.params.id);

    if (!producto || producto.Estado === "Inactivo") {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.json({ status: "ok", data: producto });

  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener producto" });
  }
}

module.exports = {
  listarProductos,
  obtenerProductoPorId
};
