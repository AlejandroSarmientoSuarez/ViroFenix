const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Producto = sequelize.define("Producto", {
  ProductoID: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  Nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  Descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  Imagen: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Precio: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  StockActual: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  StockMaximo: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 50,
  },
  Estado: {
    type: DataTypes.ENUM("Disponible", "PocasUnidades", "Agotado", "Inactivo"),
    allowNull: false,
    defaultValue: "Disponible",
  },
  Destacado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: "productos",
  timestamps: true,
  createdAt: "FechaCreacion",
  updatedAt: "FechaActualizacion",
});

module.exports = Producto;