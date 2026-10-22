
const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");
const CarritoDetalle = require("../models/CarritoDetalle");
const Pedido = require("../models/Pedido");
const DetallePedido = require("../models/DetallePedido");
const Producto = require("../models/Producto");
const { obtenerOCrearCarritoActivo } = require("./cartController");

async function crearPedido(req, res) {
  const { direccion, email } = req.body;

  if (!direccion || !email) {
    return res.status(400).json({ mensaje: "Completa los datos" });
  }

  const transaccion = await sequelize.transaction();

  try {
    const carrito = await obtenerOCrearCarritoActivo(req.usuario.id);

    const items = await sequelize.query(
      `SELECT cd.ProductoID, cd.Cantidad, p.Precio,
      p.StockActual, p.Nombre, p.Imagen
      FROM carrito_detalle cd
      JOIN productos p ON p.ProductoID = cd.ProductoID
      WHERE cd.CarritoID = :id`,
      {
        replacements: { id: carrito.CarritoID },
        type: QueryTypes.SELECT,
        transaction: transaccion
      }
    );

    if (items.length === 0) {
      await transaccion.rollback();
      return res.status(400).json({ mensaje: "El carrito está vacío" });
    }

    let total = 0;

    for (let i = 0; i < items.length; i++) {
      if (items[i].Cantidad > items[i].StockActual) {
        await transaccion.rollback();
        return res.status(400).json({
          mensaje: "No hay suficiente stock de " + items[i].Nombre
        });
      }

      total += items[i].Cantidad * Number(items[i].Precio);
    }

    const pedido = await Pedido.create({
      UsuarioID: req.usuario.id,
      Total: total,
      Estado: "Pendiente",
      DireccionEnvio: direccion,
      EmailContacto: email
    }, { transaction: transaccion });

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      await DetallePedido.create({
        PedidoID: pedido.PedidoID,
        ProductoID: item.ProductoID,
        Cantidad: item.Cantidad,
        PrecioUnitario: item.Precio
      }, { transaction: transaccion });

      await Producto.update({
        StockActual: item.StockActual - item.Cantidad
      }, {
        where: { ProductoID: item.ProductoID },
        transaction: transaccion
      });
    }

    await CarritoDetalle.destroy({
      where: { CarritoID: carrito.CarritoID },
      transaction: transaccion
    });

    carrito.Estado = "Comprado";
    await carrito.save({ transaction: transaccion });

    await transaccion.commit();

    return res.status(201).json({
      mensaje: "Pedido creado correctamente",
      pedidoId: pedido.PedidoID,
      total: total
    });
  } catch (error) {
    if (!transaccion.finished) {
      await transaccion.rollback();
    }

    return res.status(500).json({ mensaje: "Error al crear pedido" });
  }
}

async function listarPedidos(req, res) {
  try {
    const pedidos = await Pedido.findAll({
      where: { UsuarioID: req.usuario.id },
      order: [["FechaCreacion", "DESC"]]
    });

    const resultado = [];

    for (let i = 0; i < pedidos.length; i++) {
      const items = await sequelize.query(
        `SELECT dp.ProductoID, dp.Cantidad, dp.PrecioUnitario,
        p.Nombre, p.Imagen
        FROM detalle_pedido dp
        JOIN productos p ON p.ProductoID = dp.ProductoID
        WHERE dp.PedidoID = :id`,
        {
          replacements: { id: pedidos[i].PedidoID },
          type: QueryTypes.SELECT
        }
      );

      resultado.push({
        ...pedidos[i].toJSON(),
        items: items
      });
    }

    return res.json({ status: "ok", data: resultado });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al listar pedidos" });
  }
}

module.exports = { crearPedido, listarPedidos };
