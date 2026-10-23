const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

// REGISTRAR USUARIO
async function register(req, res) {
  try {
    const { nombre, apellido, email, password } = req.body;

    if (!nombre || !apellido || !email || !password)
      return res.status(400).json({ message: "Faltan datos" });

    if (password.length < 8)
      return res.status(400).json({ message: "La contraseña debe tener 8 caracteres" });

    if (!email.includes("@") || !email.includes("."))
      return res.status(400).json({ message: "Email inválido" });

    const existe = await Usuario.findOne({ where: { Email: email.trim() } });

    if (existe)
      return res.status(409).json({ message: "Email ya registrado" });

    const usuario = await Usuario.create({
      Nombre: nombre.trim(),
      Apellido: apellido.trim(),
      Email: email.trim(),
      PasswordHash: await bcrypt.hash(password, 10)
    });

    res.status(201).json({
      message: "Usuario registrado",
      id: usuario.UsuarioID
    });

  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario" });
  }
}

// INICIAR SESION
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Faltan datos" });

    const usuario = await Usuario.findOne({
      where: { Email: email.trim() }
    });

    if (!usuario || usuario.Estado === "Eliminado")
      return res.status(401).json({ message: "Datos incorrectos" });

    if (usuario.Estado === "Bloqueado")
      return res.status(403).json({ message: "Cuenta bloqueada" });

    const coincide = await bcrypt.compare(password, usuario.PasswordHash);

    if (!coincide)
      return res.status(401).json({ message: "Datos incorrectos" });

    const token = jwt.sign(
      {
        id: usuario.UsuarioID,
        rol: usuario.Rol
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Inicio de sesión correcto",
      token: token,
      usuario: {
        id: usuario.UsuarioID,
        nombre: usuario.Nombre,
        apellido: usuario.Apellido,
        email: usuario.Email,
        rol: usuario.Rol
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
}

// RECUPERAR CONTRASEÑA
async function solicitarRecuperacion(req, res) {
  try {
    const email = req.body.email;

    if (!email)
      return res.status(400).json({ message: "Ingresá tu email" });

    const usuario = await Usuario.findOne({
      where: { Email: email }
    });

    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const token = Date.now().toString();

    usuario.TokenRecuperacion = token;

    const fecha = new Date();
    fecha.setMinutes(fecha.getMinutes() + 30);
    usuario.TokenExpiracion = fecha;

    await usuario.save();

    res.json({
      message: "Enlace creado",
      enlace: "http://localhost:5173/restablecer?token=" + token
    });

  } catch (error) {
    res.status(500).json({ message: "Error al recuperar contraseña" });
  }
}

// CAMBIAR CONTRASEÑA
async function restablecerPassword(req, res) {
  try {
    const { token, passwordNueva } = req.body;

    if (!token || !passwordNueva)
      return res.status(400).json({ message: "Faltan datos" });

    if (passwordNueva.length < 8)
      return res.status(400).json({ message: "La contraseña debe tener 8 caracteres" });

    const usuario = await Usuario.findOne({
      where: { TokenRecuperacion: token }
    });

    if (!usuario || !usuario.TokenExpiracion || new Date() > new Date(usuario.TokenExpiracion))
      return res.status(400).json({ message: "Enlace inválido o vencido" });

    usuario.PasswordHash = await bcrypt.hash(passwordNueva, 10);
    usuario.TokenRecuperacion = null;
    usuario.TokenExpiracion = null;
    usuario.IntentosFallidos = 0;
    usuario.BloqueadoHasta = null;

    if (usuario.Estado === "Bloqueado")
      usuario.Estado = "Activo";

    await usuario.save();

    res.json({ message: "Contraseña cambiada correctamente" });

  } catch (error) {
    res.status(500).json({ message: "Error al cambiar contraseña" });
  }
}

module.exports = {
  register,
  login,
  solicitarRecuperacion,
  restablecerPassword
};