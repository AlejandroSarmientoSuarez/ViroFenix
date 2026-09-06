const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DetallePedido = sequelize.define("DetallePedido", {
  DetallePedidoID: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  PedidoID: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  ProductoID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  Cantidad: {
    type: DataTypes.SMALLINT.UNSIGNED,
    allowNull: false,
  },
  PrecioUnitario: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
}, {
  tableName: "detalle_pedido",
  timestamps: false,
});

module.exports = DetallePedido;