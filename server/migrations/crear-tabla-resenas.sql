-- Ejecutar una sola vez en la base de datos 2t.
-- Una reseña por cliente y producto; las reseñas se guardan de forma persistente.
CREATE TABLE IF NOT EXISTS `resenas` (
  `ResenaID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ProductoID` int(10) unsigned NOT NULL,
  `UsuarioID` int(10) unsigned NOT NULL,
  `Calificacion` tinyint(3) unsigned NOT NULL,
  `Comentario` text NOT NULL,
  `FechaCreacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `FechaActualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`ResenaID`),
  UNIQUE KEY `uq_resena_producto_usuario` (`ProductoID`, `UsuarioID`),
  KEY `idx_resenas_producto_fecha` (`ProductoID`, `FechaCreacion`),
  CONSTRAINT `fk_resenas_producto` FOREIGN KEY (`ProductoID`) REFERENCES `productos` (`ProductoID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_resenas_usuario` FOREIGN KEY (`UsuarioID`) REFERENCES `usuarios` (`UsuarioID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_resenas_calificacion` CHECK (`Calificacion` BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
