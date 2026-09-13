const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");
const Carrito = require("../models/Carrito");
const CarritoDetalle = require("../models/CarritoDetalle");
const Pedido = require("../models/Pedido");
const DetallePedido = require("../models/DetallePedido");
const Producto = require("../models/Producto");
const { obtenerOCrearCarritoActivo } = require("./cartController");

async function crearPedido(req, res) {
  const t = await sequelize.transaction();

  try {
    const carrito = await obtenerOCrearCarritoActivo(req.usuario.id);

    const items = await sequelize.query(
      `SELECT cd.ProductoID, cd.Cantidad, p.Precio, p.StockActual, p.Nombre
       FROM carrito_detalle cd
       INNER JOIN productos p ON p.ProductoID = cd.ProductoID
       WHERE cd.CarritoID = :carritoId`,
      { replacements: { carritoId: carrito.CarritoID }, type: QueryTypes.SELECT, transaction: t }
    );

    if (items.length === 0) {
      await t.rollback();
      return res.status(400).json({ status: "error", message: "El carrito está vacío" });
    }

    for (const item of items) {
      if (item.Cantidad > item.StockActual) {
        await t.rollback();
        return res.status(409).json({
          status: "error",
          message: `No hay suficiente stock de "${item.Nombre}"`,
        });
      }
    }

    const total = items.reduce((acc, item) => acc + item.Cantidad * Number(item.Precio), 0);

    const pedido = await Pedido.create(
      { UsuarioID: req.usuario.id, Total: total, Estado: "Pendiente" },
      { transaction: t }
    );

    for (const item of items) {
      await DetallePedido.create(
        {
          PedidoID: pedido.PedidoID,
          ProductoID: item.ProductoID,
          Cantidad: item.Cantidad,
          PrecioUnitario: item.Precio,
        },
        { transaction: t }
      );

      await Producto.update(
        { StockActual: item.StockActual - item.Cantidad },
        { where: { ProductoID: item.ProductoID }, transaction: t }
      );
    }

    await CarritoDetalle.destroy({ where: { CarritoID: carrito.CarritoID }, transaction: t });
    carrito.Estado = "Comprado";
    await carrito.save({ transaction: t });

    await t.commit();

    return res.status(201).json({
      status: "ok",
      message: "Pedido creado correctamente",
      data: { pedidoId: pedido.PedidoID, total },
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al crear el pedido" });
  }
}

async function listarPedidos(req, res) {
  try {
    const pedidos = await Pedido.findAll({
      where: { UsuarioID: req.usuario.id },
      order: [["FechaCreacion", "DESC"]],
    });
    return res.status(200).json({ status: "ok", data: pedidos });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al obtener pedidos" });
  }
}

module.exports = { crearPedido, listarPedidos };