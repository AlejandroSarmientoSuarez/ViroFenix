
const Producto = require("../models/Producto");

// LISTAR STOCK
async function listarStock(req, res) {
  try {
    const productos = await Producto.findAll({
      where: {
        Estado: ["Disponible", "PocasUnidades", "Agotado"]
      },
      order: [
        ["StockActual", "ASC"],
        ["Nombre", "ASC"]
      ]
    });

    res.json({
      status: "ok",
      data: productos
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al consultar el stock"
    });
  }
}

// REPONER STOCK
async function reponerStock(req, res) {
  const cantidad = Number(req.body.cantidad);

  // Validar la cantidad ingresada
  if (Number.isInteger(cantidad) === false || cantidad < 1) {
    return res.status(400).json({
      mensaje: "Ingresá una cantidad entera mayor que cero"
    });
  }

  try {
    // Buscar el producto por su ID
    const producto = await Producto.findByPk(req.params.id);

    if (!producto || producto.Estado === "Inactivo") {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }


    const nuevoStock = producto.StockActual + cantidad;

    if (nuevoStock > producto.StockMaximo) {
      return res.status(400).json({
        mensaje: "El stock no puede superar " +
          producto.StockMaximo + " unidades"
      });
    }


    producto.StockActual = nuevoStock;

    await producto.save();

    res.json({
      mensaje: "Stock actualizado correctamente",
      data: producto
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al reponer el stock"
    });
  }
}


module.exports = {
  listarStock,
  reponerStock
};
