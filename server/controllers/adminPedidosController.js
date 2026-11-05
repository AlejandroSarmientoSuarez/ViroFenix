// server/controllers/adminPedidosController.js

const Pedido = require("../models/Pedido");
const DetallePedido = require("../models/DetallePedido");
const Producto = require("../models/Producto");
const Usuario = require("../models/Usuario");
const sequelize = require("../config/db");

async function listarPedidosAdmin(req, res) {
  try {
    const pedidos = await Pedido.findAll({
      order: [["FechaCreacion", "DESC"]]
    });

    const resultado = [];

    for (const pedido of pedidos) {
      const usuario = await Usuario.findByPk(pedido.UsuarioID);
      const detalles = await DetallePedido.findAll({
        where: { PedidoID: pedido.PedidoID }
      });

      const items = [];

      for (const detalle of detalles) {
        const producto = await Producto.findByPk(detalle.ProductoID);

        items.push({
          ProductoID: detalle.ProductoID,
          Nombre: producto ? producto.Nombre : "Producto eliminado",
          Cantidad: detalle.Cantidad,
          PrecioUnitario: detalle.PrecioUnitario
        });
      }

      resultado.push({
        ...pedido.toJSON(),
        Cliente: usuario
          ? `${usuario.Nombre} ${usuario.Apellido}`
          : "Cliente eliminado",
        items
      });
    }

    res.json({ status: "ok", data: resultado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al listar pedidos" });
  }
}

async function actualizarEstadoPedido(req, res) {
  const { estado } = req.body;
  const estados = ["Pendiente", "Pagado", "Enviado", "Entregado", "Cancelado"];

  if (!estados.includes(estado)) {
    return res.status(400).json({ mensaje: "Estado no válido" });
  }

  const transaccion = await sequelize.transaction();

  try {
    const pedido = await Pedido.findByPk(req.params.id, {
      transaction: transaccion,
      lock: true
    });

    if (!pedido) {
      await transaccion.rollback();
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    const permitidos = {
      Pendiente: ["Pagado", "Cancelado"],
      Pagado: ["Enviado"],
      Enviado: ["Entregado"],
      Entregado: [],
      Cancelado: []
    };

    if (!permitidos[pedido.Estado].includes(estado)) {
      await transaccion.rollback();
      return res.status(400).json({
        mensaje: `No se puede cambiar de ${pedido.Estado} a ${estado}`
      });
    }

    if (estado === "Cancelado") {
      const detalles = await DetallePedido.findAll({
        where: { PedidoID: pedido.PedidoID },
        transaction: transaccion
      });

      for (const detalle of detalles) {
        const producto = await Producto.findByPk(detalle.ProductoID, {
          transaction: transaccion,
          lock: true
        });

        if (producto) {
          producto.StockActual += detalle.Cantidad;
          await producto.save({ transaction: transaccion });
        }
      }
    }

    const fechas = {};

    if (estado === "Pagado") fechas.FechaPago = new Date();
    if (estado === "Enviado") fechas.FechaEnvio = new Date();
    if (estado === "Entregado") fechas.FechaEntrega = new Date();

    await pedido.update(
      { Estado: estado, ...fechas },
      { transaction: transaccion }
    );

    await transaccion.commit();

    res.json({
      mensaje: "Estado del pedido actualizado",
      data: pedido
    });
  } catch (error) {
    await transaccion.rollback();
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar el pedido" });
  }
}

module.exports = {
  listarPedidosAdmin,
  actualizarEstadoPedido
};