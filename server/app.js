
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const sequelize = require("./config/db");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/img", express.static(path.join(__dirname, "public/img")));

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/productos", require("./routes/productRoutes"));
app.use("/api/carrito", require("./routes/cartRoutes"));
app.use("/api/pedidos", require("./routes/pedidoRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.json({ mensaje: "Servidor funcionando" });
});

sequelize.authenticate()
  .then(() => console.log("Base de datos conectada"))
  .catch(() => console.log("Error al conectar la base de datos"));

app.listen(process.env.PORT || 4000, () => {
  console.log("Servidor iniciado");
});
