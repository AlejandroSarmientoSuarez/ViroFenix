const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Usuario = sequelize.define("Usuario", {
  UsuarioID: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Apellido: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING(254),
    allowNull: false,
    unique: true,
  },
  PasswordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Rol: {
    type: DataTypes.ENUM("Admin", "Cliente"),
    allowNull: false,
    defaultValue: "Cliente",
  },
  Estado: {
    type: DataTypes.ENUM("Activo", "Bloqueado", "Pendiente"),
    allowNull: false,
    defaultValue: "Activo",
  },
  IntentosFallidos: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  UltimoIntento: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  BloqueadoHasta: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  UltimoAcceso: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  TokenRecuperacion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  TokenExpiracion: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: "usuarios",
  timestamps: true,
  createdAt: "FechaRegistro",
  updatedAt: "FechaActualizacion",
});

module.exports = Usuario;