const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Usuario = require("./Usuario");
const Producto = require("./Producto");

const Resena = sequelize.define("Resena", {
  ResenaID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  ProductoID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  UsuarioID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  Calificacion: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  Comentario: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { notEmpty: true, len: [2, 2000] }
  }
}, {
  tableName: "resenas",
  timestamps: true,
  createdAt: "FechaCreacion",
  updatedAt: "FechaActualizacion",
  indexes: [
    { unique: true, fields: ["ProductoID", "UsuarioID"] }
  ]
});

Resena.belongsTo(Usuario, { foreignKey: "UsuarioID", as: "usuario" });
Resena.belongsTo(Producto, { foreignKey: "ProductoID", as: "producto" });

module.exports = Resena;
