const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Favorito = sequelize.define("Favorito", {
  FavoritoID: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  UsuarioID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  ProductoID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
}, {
  tableName: "favoritos",
  timestamps: true,
  createdAt: "FechaAgregado",
  updatedAt: false,
});

module.exports = Favorito;