const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");
const Carrito = require("../models/Carrito");
const CarritoDetalle = require("../models/CarritoDetalle");
const Producto = require("../models/Producto");

async function obtenerOCrearCarritoActivo(usuarioId) {
  let carrito = await Carrito.findOne({
    where: { UsuarioID: usuarioId, Estado: "Activo" },
  });
  if (!carrito) {
    carrito = await Carrito.create({ UsuarioID: usuarioId });
  }
  return carrito;
}

async function obtenerCarrito(req, res) {
  try {
    const carrito = await obtenerOCrearCarritoActivo(req.usuario.id);

    const items = await sequelize.query(
      `SELECT cd.CarritoDetalleID, cd.ProductoID, cd.Cantidad,
              p.Nombre, p.Precio, p.Imagen, p.StockActual
       FROM carrito_detalle cd
       INNER JOIN productos p ON p.ProductoID = cd.ProductoID
       WHERE cd.CarritoID = :carritoId
       ORDER BY cd.CarritoDetalleID ASC`,
      { replacements: { carritoId: carrito.CarritoID }, type: QueryTypes.SELECT }
    );

    const total = items.reduce((acc, item) => acc + item.Cantidad * Number(item.Precio), 0);

    return res.status(200).json({
      status: "ok",
      data: { carritoId: carrito.CarritoID, items, total },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al obtener el carrito" });
  }
}

async function agregarProducto(req, res) {
  try {
    const { productoId } = req.params;
    const cantidad = Number(req.body.cantidad) || 1;

    const producto = await Producto.findByPk(productoId);
    if (!producto) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    if (producto.StockActual < 1) {
      return res.status(409).json({ status: "error", message: "Producto sin stock" });
    }

    const carrito = await obtenerOCrearCarritoActivo(req.usuario.id);

    let detalle = await CarritoDetalle.findOne({
      where: { CarritoID: carrito.CarritoID, ProductoID: productoId },
    });

    if (detalle) {
      const nuevaCantidad = Math.min(detalle.Cantidad + cantidad, producto.StockActual);
      detalle.Cantidad = nuevaCantidad;
      await detalle.save();
    } else {
      detalle = await CarritoDetalle.create({
        CarritoID: carrito.CarritoID,
        ProductoID: productoId,
        Cantidad: Math.min(cantidad, producto.StockActual),
      });
    }

    return res.status(200).json({ status: "ok", message: "Agregado al carrito" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al agregar al carrito" });
  }
}

async function actualizarCantidad(req, res) {
  try {
    const { productoId } = req.params;
    const cantidad = Number(req.body.cantidad);

    const carrito = await obtenerOCrearCarritoActivo(req.usuario.id);
    const detalle = await CarritoDetalle.findOne({
      where: { CarritoID: carrito.CarritoID, ProductoID: productoId },
    });

    if (!detalle) {
      return res.status(404).json({ status: "error", message: "Producto no está en el carrito" });
    }

    if (cantidad <= 0) {
      await detalle.destroy();
      return res.status(200).json({ status: "ok", message: "Producto eliminado del carrito" });
    }

    const producto = await Producto.findByPk(productoId);
    detalle.Cantidad = Math.min(cantidad, producto.StockActual);
    await detalle.save();

    return res.status(200).json({ status: "ok", message: "Cantidad actualizada" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al actualizar cantidad" });
  }
}

async function eliminarProducto(req, res) {
  try {
    const { productoId } = req.params;
    const carrito = await obtenerOCrearCarritoActivo(req.usuario.id);

    await CarritoDetalle.destroy({
      where: { CarritoID: carrito.CarritoID, ProductoID: productoId },
    });

    return res.status(200).json({ status: "ok", message: "Producto eliminado" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al eliminar producto" });
  }
}

module.exports = { obtenerCarrito, agregarProducto, actualizarCantidad, eliminarProducto, obtenerOCrearCarritoActivo };
