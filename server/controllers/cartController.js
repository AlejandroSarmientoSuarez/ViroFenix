const Carrito = require("../models/Carrito");
const CarritoDetalle = require("../models/CarritoDetalle");
const Producto = require("../models/Producto");

// BUSCAR O CREAR CARRITO
async function obtenerOCrearCarritoActivo(usuarioId) {
  let carrito = await Carrito.findOne({
    where: { UsuarioID: usuarioId, Estado: "Activo" }
  });

  if (!carrito) {
    carrito = await Carrito.create({ UsuarioID: usuarioId });
  }

  return carrito;
}

// VER CARRITO
async function obtenerCarrito(req, res) {
  try {
    const carrito = await obtenerOCrearCarritoActivo(req.usuario.id);

    const detalles = await CarritoDetalle.findAll({
      where: { CarritoID: carrito.CarritoID }
    });

    let total = 0;
    const productos = [];

    for (let i = 0; i < detalles.length; i++) {
      const producto = await Producto.findByPk(detalles[i].ProductoID);

      if (producto) {
        total += producto.Precio * detalles[i].Cantidad;

        productos.push({
          ProductoID: producto.ProductoID,
          Nombre: producto.Nombre,
          Precio: producto.Precio,
          Imagen: producto.Imagen,
          StockActual: producto.StockActual,
          Cantidad: detalles[i].Cantidad
        });
      }
    }

    res.json({
      carritoId: carrito.CarritoID,
      productos: productos,
      total: total
    });

  } catch (error) {
    res.status(500).json({ mensaje: "Error al ver carrito" });
  }
}

// AGREGAR PRODUCTO
async function agregarProducto(req, res) {
  try {
    const producto = await Producto.findByPk(req.params.productoId);

    if (!producto || producto.StockActual < 1)
      return res.status(400).json({ mensaje: "Producto no disponible" });

    const carrito = await obtenerOCrearCarritoActivo(req.usuario.id);
    const cantidad = Number(req.body.cantidad) || 1;

    let detalle = await CarritoDetalle.findOne({
      where: {
        CarritoID: carrito.CarritoID,
        ProductoID: producto.ProductoID
      }
    });

    if (detalle) {
      detalle.Cantidad = detalle.Cantidad + cantidad;

      if (detalle.Cantidad > producto.StockActual)
        detalle.Cantidad = producto.StockActual;

      await detalle.save();

    } else {
      let nuevaCantidad = cantidad;

      if (nuevaCantidad > producto.StockActual)
        nuevaCantidad = producto.StockActual;

      await CarritoDetalle.create({
        CarritoID: carrito.CarritoID,
        ProductoID: producto.ProductoID,
        Cantidad: nuevaCantidad
      });
    }

    res.json({ mensaje: "Producto agregado" });

  } catch (error) {
    res.status(500).json({ mensaje: "Error al agregar producto" });
  }
}

// CAMBIAR CANTIDAD
async function actualizarCantidad(req, res) {
  try {
    const carrito = await obtenerOCrearCarritoActivo(req.usuario.id);

    const detalle = await CarritoDetalle.findOne({
      where: {
        CarritoID: carrito.CarritoID,
        ProductoID: req.params.productoId
      }
    });

    if (!detalle)
      return res.status(404).json({ mensaje: "Producto no encontrado" });

    const cantidad = Number(req.body.cantidad);

    if (cantidad <= 0) {
      await detalle.destroy();
      return res.json({ mensaje: "Producto eliminado" });
    }

    const producto = await Producto.findByPk(req.params.productoId);

    if (!producto || producto.StockActual < 1) {
      await detalle.destroy();
      return res.json({ mensaje: "Producto sin stock" });
    }

    detalle.Cantidad = cantidad;

    if (detalle.Cantidad > producto.StockActual)
      detalle.Cantidad = producto.StockActual;

    await detalle.save();

    res.json({ mensaje: "Cantidad actualizada" });

  } catch (error) {
    res.status(500).json({ mensaje: "Error al cambiar cantidad" });
  }
}

// ELIMINAR PRODUCTO
async function eliminarProducto(req, res) {
  try {
    const carrito = await obtenerOCrearCarritoActivo(req.usuario.id);

    await CarritoDetalle.destroy({
      where: {
        CarritoID: carrito.CarritoID,
        ProductoID: req.params.productoId
      }
    });

    res.json({ mensaje: "Producto eliminado" });

  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar producto" });
  }
}

module.exports = {
  obtenerCarrito,
  agregarProducto,
  actualizarCantidad,
  eliminarProducto,
  obtenerOCrearCarritoActivo
};