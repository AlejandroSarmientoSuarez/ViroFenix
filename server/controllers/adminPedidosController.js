
const Pedido = require("../models/Pedido");
const DetallePedido = require("../models/DetallePedido");
const Producto = require("../models/Producto");
const Usuario = require("../models/Usuario");
const sequelize = require("../config/db");

// LISTAR PEDIDOS
async function listarPedidosAdmin(req, res) {
  try {
    const pedidos = await Pedido.findAll({
      order: [["FechaCreacion", "DESC"]]
    });

    const resultado = [];

    for (const pedido of pedidos) {
      const usuario = await Usuario.findByPk(pedido.UsuarioID);
      let cliente = "Cliente eliminado";

      if (usuario) {
        cliente = usuario.Nombre + " " + usuario.Apellido;
      }

      const detalles = await DetallePedido.findAll({
        where: { PedidoID: pedido.PedidoID }
      });

      const items = [];

      for (const detalle of detalles) {
        const producto = await Producto.findByPk(detalle.ProductoID);
        let nombre = "Producto eliminado";

        if (producto) {
          nombre = producto.Nombre;
        }

        items.push({
          ProductoID: detalle.ProductoID,
          Nombre: nombre,
          Cantidad: detalle.Cantidad,
          PrecioUnitario: detalle.PrecioUnitario
        });
      }

      const pedidoCompleto = pedido.toJSON();
      pedidoCompleto.Cliente = cliente;
      pedidoCompleto.items = items;
      resultado.push(pedidoCompleto);
    }

    res.json({ status: "ok", data: resultado });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al listar pedidos" });
  }
}

// ACTUALIZAR ESTADO DEL PEDIDO
async function actualizarEstadoPedido(req, res) {
  const estado = req.body.estado;

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
        mensaje: "No se puede cambiar de " + pedido.Estado + " a " + estado
      });
    }

    // DEVOLVER STOCK SI SE CANCELA
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
          producto.StockActual = producto.StockActual + detalle.Cantidad;
          await producto.save({ transaction: transaccion });
        }
      }
    }

    // REGISTRAR FECHAS
    const datos = { Estado: estado };

    if (estado === "Pagado") datos.FechaPago = new Date();
    if (estado === "Enviado") datos.FechaEnvio = new Date();
    if (estado === "Entregado") datos.FechaEntrega = new Date();

    await pedido.update(datos, { transaction: transaccion });

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

// EXPORTAR FUNCIONES
module.exports = {
  listarPedidosAdmin,
  actualizarEstadoPedido
};
