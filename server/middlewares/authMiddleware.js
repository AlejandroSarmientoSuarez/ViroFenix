
const jwt = require("jsonwebtoken");

// Verifica que la solicitud tenga un token válido antes de permitir el acceso.
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Token no proporcionado",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Valida el token y guarda los datos del usuario para usarlos en otras funciones.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;

    // Permite continuar si el token es válido.
    next();
  } catch (error) {
    return res.status(403).json({
      status: "error",
      message: "Token inválido o expirado",
    });
  }
}

module.exports = verificarToken;
