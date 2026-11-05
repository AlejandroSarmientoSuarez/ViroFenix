const Resena = require("../models/Resena");
const Producto = require("../models/Producto");
const Usuario = require("../models/Usuario");

async function listarResenas(req, res) {
  try {
    const productoId = Number(req.params.productoId);
    if (!Number.isInteger(productoId) || productoId < 1) {
      return res.status(400).json({ mensaje: "Producto inválido" });
    }

    const producto = await Producto.findByPk(productoId);
    if (!producto || producto.Estado === "Inactivo") {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const resenas = await Resena.findAll({
      where: { ProductoID: productoId },
      include: [{ model: Usuario, as: "usuario", attributes: ["UsuarioID", "Nombre", "Apellido"] }],
      order: [["FechaCreacion", "DESC"]]
    });

    const total = resenas.length;
    const promedio = total
      ? Math.round((resenas.reduce((suma, r) => suma + r.Calificacion, 0) / total) * 10) / 10
      : 0;

    res.json({
      status: "ok",
      data: resenas.map((r) => ({
        ResenaID: r.ResenaID,
        Calificacion: r.Calificacion,
        Comentario: r.Comentario,
        FechaCreacion: r.FechaCreacion,
        UsuarioID: r.UsuarioID,
        NombreUsuario: `${r.usuario?.Nombre || "Cliente"} ${r.usuario?.Apellido || ""}`.trim()
      })),
      resumen: { total, promedio }
    });
  } catch (error) {
    console.error("Error al listar reseñas:", error);
    res.status(500).json({ mensaje: "Error al obtener las reseñas" });
  }
}

async function crearResena(req, res) {
  try {
    const productoId = Number(req.params.productoId);
    const calificacion = Number(req.body.calificacion);
    const comentario = typeof req.body.comentario === "string" ? req.body.comentario.trim() : "";
    const usuarioId = Number(req.usuario.id);

    if (!Number.isInteger(productoId) || productoId < 1) {
      return res.status(400).json({ mensaje: "Producto inválido" });
    }
    if (!Number.isInteger(calificacion) || calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ mensaje: "La calificación debe ser de 1 a 5 estrellas" });
    }
    if (comentario.length < 2 || comentario.length > 2000) {
      return res.status(400).json({ mensaje: "El comentario debe tener entre 2 y 2000 caracteres" });
    }

    const producto = await Producto.findByPk(productoId);
    if (!producto || producto.Estado === "Inactivo") {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const existente = await Resena.findOne({ where: { ProductoID: productoId, UsuarioID: usuarioId } });
    if (existente) {
      return res.status(409).json({ mensaje: "Ya publicaste una reseña para este producto." });
    }

    const resena = await Resena.create({
      ProductoID: productoId,
      UsuarioID: usuarioId,
      Calificacion: calificacion,
      Comentario: comentario
    });

    const resenaCompleta = await Resena.findByPk(resena.ResenaID, {
      include: [{ model: Usuario, as: "usuario", attributes: ["Nombre", "Apellido"] }]
    });

    res.status(201).json({
      mensaje: "¡Gracias por compartir tu opinión!",
      data: {
        ResenaID: resenaCompleta.ResenaID,
        Calificacion: resenaCompleta.Calificacion,
        Comentario: resenaCompleta.Comentario,
        FechaCreacion: resenaCompleta.FechaCreacion,
        UsuarioID: resenaCompleta.UsuarioID,
        NombreUsuario: `${resenaCompleta.usuario?.Nombre || "Cliente"} ${resenaCompleta.usuario?.Apellido || ""}`.trim()
      }
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ mensaje: "Ya publicaste una reseña para este producto." });
    }
    console.error("Error al crear reseña:", error);
    res.status(500).json({ mensaje: "Error al guardar la reseña" });
  }
}

module.exports = { listarResenas, crearResena };
