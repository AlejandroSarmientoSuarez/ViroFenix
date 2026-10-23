
const Carrito = require("../models/Carrito");
const CarritoDetalle = require("../models/CarritoDetalle");
const Producto = require("../models/Producto");
const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");

// Busca el carrito activo del usuario o crea uno si todavía no tiene.
async function obtenerOCrearCarritoActivo(usuarioId) {
  let carrito = await Carrito.findOne({
    where: { UsuarioID: usuarioId, Estado: "Activo" }
  });

  if (!carrito) {
    carrito = await Carrito.create({ UsuarioID: usuarioId });
  }

  return carrito;
}

// Obtiene los productos del carrito y calcula el precio total.
async function obtenerCarrito(req, res) {
  try {
    const carrito = await obtenerOCrearCarritoActivo(req.usuario.id);

    const items = await sequelize.query(
      `SELECT cd.ProductoID, cd.Cantidad, p.Nombre, p.Precio,
      p.Imagen, p.StockActual
      FROM carrito_detalle cd
      JOIN productos p ON p.ProductoID = cd.ProductoID
      WHERE cd.CarritoID = :id`,
      {
        replacements: { id: carrito.CarritoID },
        type: QueryTypes.SELECT
      }
    );

    // Suma el precio de cada producto multiplicado por su cantidad.
    let total = 0;

    for (let i = 0; i < items.length; i++) {
      total += items[i].Cantidad * Number(items[i].Precio);
    }

    return res.json({
      status: "ok",
      data: { carritoId: carrito.CarritoID, items, total }
    });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener carrito" });
  }
}

// Agrega un producto al carrito y evita superar el stock disponible.
async function agregarProducto(req, res) {
  try {
    const producto = await Producto.findByPk(req.params.productoId);

    if (!producto || producto.StockActual < 1) {
      return res.status(400).json({ mensaje: "Producto no disponible" });
    }

    const carrito = await obtenerOCrearCarritoActivo(req.usuario.id);
    const cantidad = Number(req.body.cantidad) || 1;

    let detalle = await CarritoDetalle.findOne({
      where: {
        CarritoID: carrito.CarritoID,
        ProductoID: producto.ProductoID
      }
    });

    // Si el producto ya está en el carrito, suma la cantidad solicitada.
    if (detalle) {
      detalle.Cantidad += cantidad;

      if (detalle.Cantidad > producto.StockActual) {
        detalle.Cantidad = producto.StockActual;
      }

      await detalle.save();
    } else {
      await CarritoDetalle.create({
        CarritoID: carrito.CarritoID,
        ProductoID: producto.ProductoID,
        Cantidad: Math.min(cantidad, producto.StockActual)
      });
    }

    return res.json({ mensaje: "Producto agregado al carrito" });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al agregar producto" });
  }
}

// Cambia la cantidad de un producto o lo elimina si la cantidad es cero o negativa.
async function actualizarCantidad(req, res) {
  try {
    const carrito = await obtenerOCrearCarritoActivo(req.usuario.id);

    const detalle = await CarritoDetalle.findOne({
      where: {
        CarritoID: carrito.CarritoID,
        ProductoID: req.params.productoId
      }
    });

    if (!detalle) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const cantidad = Number(req.body.cantidad);

    if (cantidad <= 0) {
      await detalle.destroy();
      return res.json({ mensaje: "Producto eliminado" });
    }

    const producto = await Producto.findByPk(req.params.productoId);

    // Elimina el producto del carrito si ya no existe o no tiene stock.
    if (!producto || producto.StockActual < 1) {
      await detalle.destroy();
      return res.json({ mensaje: "Producto sin stock" });
    }

    // Limita la cantidad al stock disponible y guarda los cambios.
    detalle.Cantidad = Math.min(Math.floor(cantidad), producto.StockActual);
    await detalle.save();

    return res.json({ mensaje: "Cantidad actualizada" });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al actualizar cantidad" });
  }
}

// Quita un producto específico del carrito del usuario.
async function eliminarProducto(req, res) {
  try {
    const carrito = await obtenerOCrearCarritoActivo(req.usuario.id);

    await CarritoDetalle.destroy({
      where: {
        CarritoID: carrito.CarritoID,
        ProductoID: req.params.productoId
      }
    });

    return res.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al eliminar producto" });
  }
}

module.exports = {
  obtenerCarrito,
  agregarProducto,
  actualizarCantidad,
  eliminarProducto,
  obtenerOCrearCarritoActivo
};
