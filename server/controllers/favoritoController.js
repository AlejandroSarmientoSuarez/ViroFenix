const Favorito = require("../models/Favorito");

async function listarFavoritos(req, res) {
  try {
    const favoritos = await Favorito.findAll({
      where: { UsuarioID: req.usuario.id },
      attributes: ["ProductoID"],
    });
    return res.status(200).json({
      status: "ok",
      data: favoritos.map((f) => f.ProductoID),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al obtener favoritos" });
  }
}

async function agregarFavorito(req, res) {
  try {
    const { productoId } = req.params;
    const existente = await Favorito.findOne({
      where: { UsuarioID: req.usuario.id, ProductoID: productoId },
    });
    if (existente) {
      return res.status(200).json({ status: "ok", message: "Ya estaba en favoritos" });
    }
    await Favorito.create({ UsuarioID: req.usuario.id, ProductoID: productoId });
    return res.status(201).json({ status: "ok", message: "Agregado a favoritos" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al agregar favorito" });
  }
}

async function quitarFavorito(req, res) {
  try {
    const { productoId } = req.params;
    await Favorito.destroy({
      where: { UsuarioID: req.usuario.id, ProductoID: productoId },
    });
    return res.status(200).json({ status: "ok", message: "Quitado de favoritos" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al quitar favorito" });
  }
}

module.exports = { listarFavoritos, agregarFavorito, quitarFavorito };