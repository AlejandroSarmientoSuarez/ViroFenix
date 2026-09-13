const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const app = express();
const path = require("path");
const favoritoRoutes = require("./routes/favoritoRoutes");
const cartRoutes = require("./routes/cartRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/favoritos", favoritoRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/carrito", cartRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/img", express.static(path.join(__dirname, "public/img")));
app.use("/api/productos", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Servidor funcionando" });
});

sequelize.authenticate()
  .then(() => console.log("Conexión a la base de datos exitosa"))
  .catch((err) => console.error("Error de conexión:", err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});