
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Producto = sequelize.define("Producto", {
  ProductoID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  Descripcion: DataTypes.TEXT,
  Imagen: DataTypes.STRING(255),
  Precio: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  StockActual: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  StockMaximo: {
    type: DataTypes.INTEGER,
    defaultValue: 50
  },
  Estado: {
    type: DataTypes.ENUM("Disponible", "PocasUnidades", "Agotado", "Inactivo"),
    defaultValue: "Disponible"
  },
  Destacado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  Categoria: {
    type: DataTypes.ENUM("Hombre", "Mujer", "Unisex"),
    defaultValue: "Unisex"
  }
}, {
  tableName: "productos",
  createdAt: "FechaCreacion",
  updatedAt: "FechaActualizacion"
});

module.exports = Producto;
