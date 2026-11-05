const Newsletter = require("../models/Newsletter");

async function suscribir(req, res) {
  try {
    const { email, edad } = req.body;

    if (!email || !edad) {
      return res.status(400).json({ status: "error", message: "Faltan datos obligatorios" });
    }

    if (Number(edad) < 13) {
      return res.status(400).json({
        status: "error",
        message: "Debés tener al menos 13 años para suscribirte",
      });
    }

    const existente = await Newsletter.findOne({ where: { Email: email } });
    if (existente) {
      if (existente.Estado === "Cancelado") {
        existente.Estado = "Suscrito";
        existente.Edad = edad;
        await existente.save();
      }
      return res.status(200).json({ status: "ok", message: "¡Ya estás suscripto!" });
    }

    await Newsletter.create({ Email: email, Edad: edad });

    return res.status(201).json({ status: "ok", message: "Te suscribiste correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al suscribirte" });
  }
}

module.exports = { suscribir };