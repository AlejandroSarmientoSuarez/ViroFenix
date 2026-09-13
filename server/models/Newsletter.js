const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Newsletter = sequelize.define("Newsletter", {
  NewsletterID: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  Email: {
    type: DataTypes.STRING(254),
    allowNull: false,
  },
  Edad: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
  },
  Estado: {
    type: DataTypes.ENUM("Suscrito", "Cancelado"),
    allowNull: false,
    defaultValue: "Suscrito",
  },
}, {
  tableName: "newsletter",
  timestamps: true,
  createdAt: "FechaRegistro",
  updatedAt: "FechaActualizacion",
});

module.exports = Newsletter;