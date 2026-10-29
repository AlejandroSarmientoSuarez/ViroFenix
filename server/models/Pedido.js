const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Pedido = sequelize.define("Pedido", {
  PedidoID: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  UsuarioID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  Total: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  Estado: {
    type: DataTypes.ENUM(
      "Pendiente",
      "Pagado",
      "Enviado",
      "Entregado",
      "Cancelado"
    ),
    allowNull: false,
    defaultValue: "Pendiente"
  },
  DireccionEnvio: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  EmailContacto: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  FechaPago: {
    type: DataTypes.DATE,
    allowNull: true
  },
  FechaEnvio: {
    type: DataTypes.DATE,
    allowNull: true
  },
  FechaEntrega: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: "pedidos",
  timestamps: true,
  createdAt: "FechaCreacion",
  updatedAt: "FechaActualizacion"
});

module.exports = Pedido;