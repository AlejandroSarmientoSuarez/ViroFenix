const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Carrito = sequelize.define("Carrito", {
  CarritoID: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  UsuarioID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  Estado: {
    type: DataTypes.ENUM("Activo", "Comprado", "Abandonado"),
    allowNull: false,
    defaultValue: "Activo",
  },
}, {
  tableName: "carrito",
  timestamps: true,
  createdAt: "FechaCreacion",
  updatedAt: "FechaActualizacion",
});

module.exports = Carrito;