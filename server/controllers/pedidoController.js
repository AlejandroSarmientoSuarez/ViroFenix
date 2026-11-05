const CarritoDetalle = require("../models/CarritoDetalle");
const Pedido = require("../models/Pedido");
const DetallePedido = require("../models/DetallePedido");
const Producto = require("../models/Producto");
const { obtenerOCrearCarritoActivo } = require("./cartController");

// CREAR PEDIDO
async function crearPedido(req, res) {
  try {
    const direccion = req.body.direccion;
    const email = req.body.email;

    if (!direccion || !email)
      return res.status(400).json({ mensaje: "Completa los datos" });

    const carrito = await obtenerOCrearCarritoActivo(req.usuario.id);

    const detalles = await CarritoDetalle.findAll({
      where: { CarritoID: carrito.CarritoID }
    });

    if (detalles.length === 0)
      return res.status(400).json({ mensaje: "El carrito está vacío" });

    let total = 0;

    for (let i = 0; i < detalles.length; i++) {
      const producto = await Producto.findByPk(detalles[i].ProductoID);

      if (!producto || detalles[i].Cantidad > producto.StockActual)
        return res.status(400).json({ mensaje: "No hay suficiente stock" });

      total = total + producto.Precio * detalles[i].Cantidad;
    }

    const pedido = await Pedido.create({
      UsuarioID: req.usuario.id,
      Total: total,
      Estado: "Pendiente",
      DireccionEnvio: direccion,
      EmailContacto: email
    });

    for (let i = 0; i < detalles.length; i++) {
      const detalle = detalles[i];
      const producto = await Producto.findByPk(detalle.ProductoID);

      await DetallePedido.create({
        PedidoID: pedido.PedidoID,
        ProductoID: producto.ProductoID,
        Cantidad: detalle.Cantidad,
        PrecioUnitario: producto.Precio
      });

      producto.StockActual = producto.StockActual - detalle.Cantidad;
      await producto.save();
    }

    await CarritoDetalle.destroy({
      where: { CarritoID: carrito.CarritoID }
    });

    carrito.Estado = "Comprado";
    await carrito.save();

    res.status(201).json({
      mensaje: "Pedido creado correctamente",
      pedidoId: pedido.PedidoID,
      total: total
    });

  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear pedido" });
  }
}

// LISTAR PEDIDOS
async function listarPedidos(req, res) {
  try {
    const pedidos = await Pedido.findAll({
      where: { UsuarioID: req.usuario.id }
    });

    const resultado = [];

    for (let i = 0; i < pedidos.length; i++) {
      const detalles = await DetallePedido.findAll({
        where: { PedidoID: pedidos[i].PedidoID }
      });

      const productos = [];

      for (let j = 0; j < detalles.length; j++) {
        const producto = await Producto.findByPk(detalles[j].ProductoID);

        productos.push({
          ProductoID: detalles[j].ProductoID,
          Cantidad: detalles[j].Cantidad,
          PrecioUnitario: detalles[j].PrecioUnitario,
          Nombre: producto ? producto.Nombre : "Producto eliminado",
          Imagen: producto ? producto.Imagen : null
        });
      }

      resultado.push({
        ...pedidos[i].toJSON(),
        items: productos
      });
    }

    res.json({ status: "ok", data: resultado });

  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar pedidos" });
  }
}

module.exports = { crearPedido, listarPedidos };