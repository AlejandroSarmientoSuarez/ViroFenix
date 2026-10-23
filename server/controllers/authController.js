
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const sequelize = require("../config/db");

// Registra un usuario nuevo validando sus datos y protegiendo su contraseña.
async function register(req, res) {
  try {
    const { nombre, apellido, email, password } = req.body;

    if (!nombre || !apellido || !email || !password)
      return res.status(400).json({ status: "error", message: "Faltan datos obligatorios" });

    if (password.length < 8)
      return res.status(400).json({ status: "error", message: "La contraseña debe tener al menos 8 caracteres" });

    if (!/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ status: "error", message: "El email no es válido" });

    if (await Usuario.findOne({ where: { Email: email } }))
      return res.status(409).json({ status: "error", message: "El email ya está registrado" });

    // Guarda los datos del usuario y genera un hash para no almacenar la contraseña original.
    const usuario = await Usuario.create({
      Nombre: nombre.trim(), Apellido: apellido.trim(), Email: email.trim(),
      PasswordHash: await bcrypt.hash(password, 10),
    });

    return res.status(201).json({
      status: "ok",
      message: "Usuario registrado correctamente",
      data: {
        id: usuario.UsuarioID, nombre: usuario.Nombre, email: usuario.Email,
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al registrar el usuario" });
  }
}

// Verifica las credenciales, controla los bloqueos y crea el token para iniciar sesión.
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ status: "error", message: "Faltan datos obligatorios" });

    const usuario = await Usuario.findOne({ where: { Email: email } });

    if (!usuario || usuario.Estado === "Eliminado")
      return res.status(401).json({ status: "error", message: "Credenciales inválidas" });

    // Impide el acceso si la cuenta sigue dentro de su período de bloqueo.
    if (usuario.Estado === "Bloqueado" && usuario.BloqueadoHasta && new Date() < new Date(usuario.BloqueadoHasta)) {
      return res.status(423).json({ status: "error", message: "Cuenta bloqueada. Intentá más tarde" });
    }

    // Si la contraseña es incorrecta, registra el intento fallido en la base de datos.
    if (!(await bcrypt.compare(password, usuario.PasswordHash))) {
      await sequelize.query("CALL sp_registrar_intento_fallido(:usuarioId)", {
        replacements: { usuarioId: usuario.UsuarioID }
      });

      return res.status(401).json({ status: "error", message: "Credenciales inválidas" });
    }

    // Registra el inicio de sesión exitoso y genera un token válido durante dos horas.
    await sequelize.query("CALL sp_login_exitoso(:usuarioId)", {
      replacements: { usuarioId: usuario.UsuarioID }
    });

    const token = jwt.sign(
      { id: usuario.UsuarioID, email: usuario.Email, rol: usuario.Rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      status: "ok",
      message: "Login correcto",
      data: {
        token,
        usuario: {
          id: usuario.UsuarioID, nombre: usuario.Nombre, apellido: usuario.Apellido,
          email: usuario.Email, rol: usuario.Rol,
        }
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al iniciar sesión" });
  }
}

// Genera un enlace temporal para que el usuario pueda recuperar su contraseña.
async function solicitarRecuperacion(req, res) {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ status: "error", message: "El email es obligatorio" });

    const usuario = await Usuario.findOne({ where: { Email: email } });

    // Devuelve el mismo mensaje para no revelar si una cuenta está registrada.
    if (!usuario)
      return res.json({ status: "ok", message: "Si el email existe, vas a recibir un enlace de recuperación" });

    // Crea un token aleatorio que vence a los 30 minutos.
    const token = crypto.randomBytes(32).toString("hex");
    usuario.TokenRecuperacion = token;
    usuario.TokenExpiracion = new Date(Date.now() + 30 * 60 * 1000);

    await usuario.save();

    const resetLink = `http://localhost:5173/restablecer?token=${token}`;

    // Muestra el enlace en la consola durante el desarrollo.
    console.log("Enlace temporal de recuperación:", resetLink);

    return res.json({
      status: "ok",
      message: "Si el email existe, vas a recibir un enlace de recuperación",
      resetLinkDev: resetLink
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al solicitar recuperación" });
  }
}

// Comprueba el token, actualiza la contraseña y elimina los datos de recuperación.
async function restablecerPassword(req, res) {
  try {
    const { token, passwordNueva } = req.body;

    if (!token || !passwordNueva)
      return res.status(400).json({ status: "error", message: "Faltan datos obligatorios" });

    if (passwordNueva.length < 8)
      return res.status(400).json({ status: "error", message: "La contraseña debe tener al menos 8 caracteres" });

    const usuario = await Usuario.findOne({ where: { TokenRecuperacion: token } });

    // Rechaza el enlace si no existe, no tiene vencimiento o ya expiró.
    if (!usuario || !usuario.TokenExpiracion || new Date() > new Date(usuario.TokenExpiracion)) {
      return res.status(400).json({ status: "error", message: "El enlace es inválido o expiró. Solicitá uno nuevo" });
    }

    usuario.PasswordHash = await bcrypt.hash(passwordNueva, 10);
    usuario.TokenRecuperacion = null;
    usuario.TokenExpiracion = null;
    usuario.IntentosFallidos = 0;
    usuario.BloqueadoHasta = null;

    // Reactiva la cuenta si estaba bloqueada.
    if (usuario.Estado === "Bloqueado") usuario.Estado = "Activo";

    await usuario.save();

    return res.json({ status: "ok", message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al restablecer la contraseña" });
  }
}

module.exports = { register, login, solicitarRecuperacion, restablecerPassword };
