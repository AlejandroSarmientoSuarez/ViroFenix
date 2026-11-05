const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CarritoDetalle = sequelize.define("CarritoDetalle", {
  CarritoDetalleID: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  CarritoID: {
    type: DataTypes.INTEGER.UNSIGNED,
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
}, {
  tableName: "carrito_detalle",
  timestamps: true,
  createdAt: "FechaAgregado",
  updatedAt: "FechaActualizacion",
});

module.exports = CarritoDetalle;