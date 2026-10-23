
const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({
      mensaje: "Token no proporcionado"
    });
  }

  try {
    req.usuario = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(403).json({
      mensaje: "Token inválido o expirado"
    });
  }
}

module.exports = verificarToken;
