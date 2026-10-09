-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-10-2026 a las 17:20:10
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `2t`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_login_exitoso` (IN `p_UsuarioID` INT UNSIGNED)   BEGIN

    UPDATE usuarios

    SET
        IntentosFallidos = 0,
        UltimoIntento = NULL,
        BloqueadoHasta = NULL,
        UltimoAcceso = CURRENT_TIMESTAMP,
        Estado = 'Activo'

    WHERE UsuarioID = p_UsuarioID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_registrar_intento_fallido` (IN `p_UsuarioID` INT UNSIGNED)   BEGIN

    UPDATE usuarios

    SET
        IntentosFallidos =
            LEAST(IntentosFallidos + 1, 10),

        UltimoIntento = CURRENT_TIMESTAMP,

        Estado =
            CASE
                WHEN IntentosFallidos + 1 >= 5
                    THEN 'Bloqueado'
                ELSE Estado
            END,

        BloqueadoHasta =
            CASE
                WHEN IntentosFallidos + 1 >= 5
                    THEN DATE_ADD(
                        CURRENT_TIMESTAMP,
                        INTERVAL 15 MINUTE
                    )
                ELSE BloqueadoHasta
            END

    WHERE UsuarioID = p_UsuarioID;

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria`
--

CREATE TABLE `auditoria` (
  `AuditoriaID` bigint(20) UNSIGNED NOT NULL,
  `UsuarioID` int(10) UNSIGNED DEFAULT NULL,
  `Accion` varchar(100) NOT NULL,
  `TablaAfectada` varchar(100) DEFAULT NULL,
  `RegistroID` bigint(20) UNSIGNED DEFAULT NULL,
  `Descripcion` varchar(500) DEFAULT NULL,
  `Fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `CarritoID` int(10) UNSIGNED NOT NULL,
  `UsuarioID` int(10) UNSIGNED NOT NULL,
  `Estado` enum('Activo','Comprado','Abandonado') NOT NULL DEFAULT 'Activo',
  `FechaCreacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `FechaActualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`CarritoID`, `UsuarioID`, `Estado`, `FechaCreacion`, `FechaActualizacion`) VALUES
(1, 2, 'Activo', '2026-09-06 02:24:52', '2026-09-06 02:24:52'),
(2, 3, 'Activo', '2026-09-06 02:26:11', '2026-09-06 02:26:11'),
(3, 4, 'Comprado', '2026-09-12 13:51:06', '2026-09-12 14:43:45'),
(4, 4, 'Comprado', '2026-09-12 14:43:46', '2026-09-25 11:20:01'),
(5, 5, 'Comprado', '2026-09-18 14:00:42', '2026-09-18 14:05:32'),
(6, 5, 'Comprado', '2026-09-18 14:05:32', '2026-09-18 14:08:44'),
(7, 5, 'Activo', '2026-09-18 14:08:44', '2026-09-18 14:08:44'),
(8, 4, 'Comprado', '2026-09-25 11:20:01', '2026-09-25 13:05:58'),
(9, 4, 'Comprado', '2026-09-25 13:05:58', '2026-09-25 13:13:20'),
(10, 4, 'Comprado', '2026-09-25 13:13:20', '2026-10-08 01:16:48'),
(11, 4, 'Comprado', '2026-10-08 01:16:48', '2026-10-09 01:11:48'),
(12, 7, 'Comprado', '2026-10-08 10:11:21', '2026-10-09 12:44:42'),
(13, 4, 'Activo', '2026-10-09 01:11:48', '2026-10-09 01:11:48'),
(14, 9, 'Comprado', '2026-10-09 01:15:48', '2026-10-09 01:17:39'),
(15, 9, 'Activo', '2026-10-09 01:17:39', '2026-10-09 01:17:39'),
(16, 7, 'Activo', '2026-10-09 12:44:42', '2026-10-09 12:44:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito_detalle`
--

CREATE TABLE `carrito_detalle` (
  `CarritoDetalleID` int(10) UNSIGNED NOT NULL,
  `CarritoID` int(10) UNSIGNED NOT NULL,
  `ProductoID` int(10) UNSIGNED NOT NULL,
  `Cantidad` smallint(5) UNSIGNED NOT NULL,
  `FechaAgregado` timestamp NOT NULL DEFAULT current_timestamp(),
  `FechaActualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Volcado de datos para la tabla `carrito_detalle`
--

INSERT INTO `carrito_detalle` (`CarritoDetalleID`, `CarritoID`, `ProductoID`, `Cantidad`, `FechaAgregado`, `FechaActualizacion`) VALUES
(1, 2, 1, 4, '2026-09-06 02:26:42', '2026-09-07 01:10:59'),
(2, 2, 3, 3, '2026-09-06 02:26:43', '2026-09-07 01:11:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedido`
--

CREATE TABLE `detalle_pedido` (
  `DetallePedidoID` bigint(20) UNSIGNED NOT NULL,
  `PedidoID` bigint(20) UNSIGNED NOT NULL,
  `ProductoID` int(10) UNSIGNED NOT NULL,
  `Cantidad` smallint(5) UNSIGNED NOT NULL,
  `PrecioUnitario` decimal(12,2) NOT NULL,
  `Subtotal` decimal(12,2) GENERATED ALWAYS AS (`Cantidad` * `PrecioUnitario`) STORED
) ;

--
-- Volcado de datos para la tabla `detalle_pedido`
--

INSERT INTO `detalle_pedido` (`DetallePedidoID`, `PedidoID`, `ProductoID`, `Cantidad`, `PrecioUnitario`) VALUES
(5, 5, 3, 1, 34990.00),
(6, 5, 7, 3, 44990.00),
(7, 6, 1, 1, 24990.00),
(8, 6, 9, 1, 19990.00),
(9, 6, 5, 1, 27990.00),
(10, 6, 6, 1, 14990.00),
(11, 7, 10, 1, 54990.00),
(12, 8, 1, 10, 24990.00),
(13, 9, 3, 4, 34990.00),
(14, 10, 3, 5, 34990.00),
(15, 11, 1, 3, 24990.00),
(16, 11, 7, 3, 44990.00),
(17, 12, 15, 7, 34990.00),
(18, 13, 14, 10, 26990.00),
(19, 14, 12, 3, 89990.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favoritos`
--

CREATE TABLE `favoritos` (
  `FavoritoID` int(10) UNSIGNED NOT NULL,
  `UsuarioID` int(10) UNSIGNED NOT NULL,
  `ProductoID` int(10) UNSIGNED NOT NULL,
  `FechaAgregado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_stock`
--

CREATE TABLE `movimientos_stock` (
  `MovimientoID` bigint(20) UNSIGNED NOT NULL,
  `ProductoID` int(10) UNSIGNED NOT NULL,
  `Tipo` enum('Entrada','Salida','Ajuste','Venta','Devolucion') NOT NULL,
  `Cantidad` int(10) UNSIGNED NOT NULL,
  `StockAnterior` int(10) UNSIGNED NOT NULL,
  `StockNuevo` int(10) UNSIGNED NOT NULL,
  `Motivo` varchar(255) DEFAULT NULL,
  `Fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ;

--
-- Volcado de datos para la tabla `movimientos_stock`
--

INSERT INTO `movimientos_stock` (`MovimientoID`, `ProductoID`, `Tipo`, `Cantidad`, `StockAnterior`, `StockNuevo`, `Motivo`, `Fecha`) VALUES
(1, 3, 'Salida', 1, 10, 9, 'Actualización automática de stock', '2026-09-12 14:43:45'),
(2, 7, 'Salida', 3, 6, 3, 'Actualización automática de stock', '2026-09-12 14:43:45'),
(3, 1, 'Salida', 1, 15, 14, 'Actualización automática de stock', '2026-09-18 14:05:32'),
(4, 9, 'Salida', 1, 30, 29, 'Actualización automática de stock', '2026-09-18 14:05:32'),
(5, 5, 'Salida', 1, 10, 9, 'Actualización automática de stock', '2026-09-18 14:05:32'),
(6, 6, 'Salida', 1, 25, 24, 'Actualización automática de stock', '2026-09-18 14:05:32'),
(7, 10, 'Salida', 1, 5, 4, 'Actualización automática de stock', '2026-09-18 14:08:44'),
(8, 1, 'Salida', 10, 14, 4, 'Actualización automática de stock', '2026-09-25 11:20:01'),
(9, 3, 'Salida', 4, 9, 5, 'Actualización automática de stock', '2026-09-25 13:05:58'),
(10, 3, 'Salida', 5, 5, 0, 'Actualización automática de stock', '2026-09-25 13:13:20'),
(11, 1, 'Salida', 3, 4, 1, 'Actualización automática de stock', '2026-10-08 01:16:48'),
(12, 7, 'Salida', 3, 3, 0, 'Actualización automática de stock', '2026-10-08 01:16:48'),
(13, 15, 'Salida', 7, 7, 0, 'Actualización automática de stock', '2026-10-09 01:11:48'),
(14, 14, 'Salida', 10, 10, 0, 'Actualización automática de stock', '2026-10-09 01:17:39'),
(15, 12, 'Salida', 3, 3, 0, 'Actualización automática de stock', '2026-10-09 12:44:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `newsletter`
--

CREATE TABLE `newsletter` (
  `NewsletterID` int(10) UNSIGNED NOT NULL,
  `Email` varchar(254) NOT NULL,
  `Edad` tinyint(3) UNSIGNED NOT NULL,
  `Estado` enum('Suscrito','Cancelado') NOT NULL DEFAULT 'Suscrito',
  `FechaRegistro` timestamp NOT NULL DEFAULT current_timestamp(),
  `FechaActualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Volcado de datos para la tabla `newsletter`
--

INSERT INTO `newsletter` (`NewsletterID`, `Email`, `Edad`, `Estado`, `FechaRegistro`, `FechaActualizacion`) VALUES
(1, 'alejandrosarmientosuarez@gmail.com', 18, 'Suscrito', '2026-09-12 15:01:25', '2026-09-12 15:01:25'),
(2, 'alsdmlsa@gmail.com', 16, 'Suscrito', '2026-10-09 12:46:35', '2026-10-09 12:46:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `PedidoID` bigint(20) UNSIGNED NOT NULL,
  `UsuarioID` int(10) UNSIGNED NOT NULL,
  `Total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `Estado` enum('Pendiente','Pagado','Enviado','Entregado','Cancelado') NOT NULL DEFAULT 'Pendiente',
  `FechaCreacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `FechaActualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `FechaPago` timestamp NULL DEFAULT NULL,
  `FechaEnvio` timestamp NULL DEFAULT NULL,
  `FechaEntrega` timestamp NULL DEFAULT NULL,
  `DireccionEnvio` varchar(255) DEFAULT NULL,
  `EmailContacto` varchar(150) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`PedidoID`, `UsuarioID`, `Total`, `Estado`, `FechaCreacion`, `FechaActualizacion`, `FechaPago`, `FechaEnvio`, `FechaEntrega`, `DireccionEnvio`, `EmailContacto`) VALUES
(5, 4, 169960.00, 'Pendiente', '2026-09-12 14:43:45', '2026-09-12 14:43:45', NULL, NULL, NULL, NULL, NULL),
(6, 5, 87960.00, 'Pendiente', '2026-09-18 14:05:32', '2026-09-18 14:05:32', NULL, NULL, NULL, NULL, NULL),
(7, 5, 54990.00, 'Pendiente', '2026-09-18 14:08:44', '2026-09-18 14:08:44', NULL, NULL, NULL, NULL, NULL),
(8, 4, 249900.00, 'Pendiente', '2026-09-25 11:20:01', '2026-09-25 11:20:01', NULL, NULL, NULL, NULL, NULL),
(9, 4, 139960.00, 'Pendiente', '2026-09-25 13:05:58', '2026-09-25 13:05:58', NULL, NULL, NULL, NULL, NULL),
(10, 4, 174950.00, 'Pendiente', '2026-09-25 13:13:20', '2026-09-25 13:13:20', NULL, NULL, NULL, NULL, NULL),
(11, 4, 209940.00, 'Pendiente', '2026-10-08 01:16:48', '2026-10-08 01:16:48', NULL, NULL, NULL, 'av. puerredon, Buenos Aires (CP 123)', 'alejandrosarmientosuarez@gmail.com'),
(12, 4, 244930.00, 'Pendiente', '2026-10-09 01:11:48', '2026-10-09 01:11:48', NULL, NULL, NULL, 'av. puerredon, Buenos Aires (CP 123)', 'alejandrosarmientosuarez@gmail.com'),
(13, 9, 269900.00, 'Pendiente', '2026-10-09 01:17:39', '2026-10-09 01:17:39', NULL, NULL, NULL, 'av. puerredon, Buenos Aires (CP 123)', 'ale123@gmail.com'),
(14, 7, 269970.00, 'Pendiente', '2026-10-09 12:44:42', '2026-10-09 12:44:42', NULL, NULL, NULL, 'av. puerredon, Buenos Aires (CP 123)', 'alejandrosarmientosuarez@gmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `ProductoID` int(10) UNSIGNED NOT NULL,
  `Nombre` varchar(150) NOT NULL,
  `Descripcion` text DEFAULT NULL,
  `Categoria` enum('Hombre','Mujer','Unisex') NOT NULL DEFAULT 'Unisex',
  `Imagen` varchar(255) DEFAULT NULL,
  `Precio` decimal(12,2) NOT NULL,
  `StockActual` int(11) NOT NULL DEFAULT 0,
  `StockMaximo` int(10) UNSIGNED NOT NULL DEFAULT 50,
  `Estado` enum('Disponible','PocasUnidades','Agotado','Inactivo') NOT NULL DEFAULT 'Disponible',
  `Destacado` tinyint(1) NOT NULL DEFAULT 0,
  `FechaCreacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `FechaActualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`ProductoID`, `Nombre`, `Descripcion`, `Categoria`, `Imagen`, `Precio`, `StockActual`, `StockMaximo`, `Estado`, `Destacado`, `FechaCreacion`, `FechaActualizacion`) VALUES
(1, 'Camisa minimalista', 'Camisa de algodón con detalles minimalistas.', 'Hombre', '1.jpg', 24990.00, 1, 50, 'PocasUnidades', 1, '2026-08-28 14:35:29', '2026-10-08 01:16:48'),
(2, 'Pantalones suaves', 'Pantalones de corte recto y tela suave.', 'Hombre', '2.jpg', 29990.00, 12, 50, 'Disponible', 0, '2026-08-28 14:35:29', '2026-09-06 22:56:10'),
(3, 'Chaqueta versátil', 'Chaqueta ligera ideal para cualquier ocasión.', 'Hombre', '3.jpg', 34990.00, 0, 50, 'Agotado', 1, '2026-08-28 14:35:29', '2026-09-25 13:13:20'),
(4, 'Vestido elegante', 'Vestido elegante para eventos especiales.', 'Mujer', '4.jpg', 39990.00, 8, 50, 'Disponible', 0, '2026-08-28 14:35:29', '2026-09-06 22:56:10'),
(5, 'Suéter acogedor', 'Suéter de lana suave ideal para climas fríos.', 'Unisex', '5.jpg', 27990.00, 9, 50, 'Disponible', 0, '2026-08-28 14:35:29', '2026-09-18 14:05:32'),
(6, 'Camiseta básica', 'Camiseta de algodón ligera y cómoda para uso diario.', 'Unisex', '6.jpg', 14990.00, 24, 50, 'Disponible', 0, '2026-08-28 14:35:29', '2026-09-18 14:05:32'),
(7, 'Blazer elegante', 'Blazer moderno perfecto para eventos formales o de oficina.', 'Hombre', '7.jpg', 44990.00, 0, 50, 'Agotado', 1, '2026-08-28 14:35:29', '2026-10-08 01:16:48'),
(8, 'Sudadera casual', 'Sudadera con capucha y bolsillo frontal, ideal para un look urbano.', 'Hombre', '8.jpg', 22990.00, 20, 50, 'Disponible', 0, '2026-08-28 14:35:29', '2026-09-06 22:56:10'),
(9, 'Shorts frescos', 'Shorts de algodón para días cálidos y estilo relajado.', 'Hombre', '9.jpg', 19990.00, 29, 50, 'Disponible', 0, '2026-08-28 14:35:29', '2026-09-18 14:05:32'),
(10, 'Abrigo clásico', 'Abrigo largo con corte moderno para la temporada invernal.', 'Hombre', '10.jpg', 54990.00, 4, 50, 'PocasUnidades', 1, '2026-08-28 14:35:29', '2026-09-18 14:08:44'),
(11, 'Chaqueta de Cuero', 'Chaqueta cómoda y negra de hombre con un estilo rockero.', 'Hombre', '11.jpg', 59990.00, 4, 50, 'PocasUnidades', 1, '2026-08-28 14:35:29', '2026-09-06 22:56:10'),
(12, 'Traje Azul Elegante', 'Traje azul moderno y elegante, ideal para eventos especiales.', 'Hombre', '12.jpg', 89990.00, 0, 50, 'Agotado', 1, '2026-08-28 14:35:29', '2026-10-09 12:44:42'),
(13, 'Bufanda moderna', 'Bufanda de lana tejida, perfecta para complementar tu outfit.', 'Unisex', '13.jpg', 12990.00, 40, 50, 'Disponible', 0, '2026-08-28 14:35:29', '2026-09-06 01:32:51'),
(14, 'Camisa Negra', 'Camisa negra de hombre moderna y ajustada al cuerpo.', 'Hombre', '14.jpg', 26990.00, 0, 50, 'Agotado', 0, '2026-08-28 14:35:29', '2026-10-09 01:17:39'),
(15, 'Pantalon de Vestir', 'Pantalón de vestir azul oscuro moderno.', 'Hombre', '15.jpg', 34990.00, 0, 50, 'Agotado', 0, '2026-08-28 14:35:29', '2026-10-09 01:11:48');

--
-- Disparadores `productos`
--
DELIMITER $$
CREATE TRIGGER `trg_productos_stock_estado` BEFORE INSERT ON `productos` FOR EACH ROW BEGIN

    IF NEW.StockActual = 0 THEN
        SET NEW.Estado = 'Agotado';

    ELSEIF NEW.StockActual <= 5 THEN
        SET NEW.Estado = 'PocasUnidades';

    ELSE
        SET NEW.Estado = 'Disponible';

    END IF;

END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_productos_stock_update` BEFORE UPDATE ON `productos` FOR EACH ROW BEGIN

    IF NEW.StockActual = 0 THEN
        SET NEW.Estado = 'Agotado';

    ELSEIF NEW.StockActual <= 5 THEN
        SET NEW.Estado = 'PocasUnidades';

    ELSE
        SET NEW.Estado = 'Disponible';

    END IF;

END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_registrar_movimiento_stock` AFTER UPDATE ON `productos` FOR EACH ROW BEGIN

    IF OLD.StockActual <> NEW.StockActual THEN

        INSERT INTO movimientos_stock
        (
            ProductoID,
            Tipo,
            Cantidad,
            StockAnterior,
            StockNuevo,
            Motivo
        )
        VALUES
        (
            NEW.ProductoID,

            CASE
                WHEN NEW.StockActual > OLD.StockActual
                    THEN 'Entrada'
                ELSE 'Salida'
            END,

            ABS(NEW.StockActual - OLD.StockActual),

            OLD.StockActual,
            NEW.StockActual,

            'Actualización automática de stock'
        );

    END IF;

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `UsuarioID` int(10) UNSIGNED NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Apellido` varchar(100) NOT NULL,
  `Email` varchar(254) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `Rol` enum('Admin','Cliente') NOT NULL DEFAULT 'Cliente',
  `Estado` enum('Activo','Bloqueado','Pendiente','Eliminado') NOT NULL DEFAULT 'Activo',
  `IntentosFallidos` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `UltimoIntento` timestamp NULL DEFAULT NULL,
  `BloqueadoHasta` timestamp NULL DEFAULT NULL,
  `UltimoAcceso` timestamp NULL DEFAULT NULL,
  `FechaRegistro` timestamp NOT NULL DEFAULT current_timestamp(),
  `FechaActualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `TokenRecuperacion` varchar(255) DEFAULT NULL,
  `TokenExpiracion` timestamp NULL DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`UsuarioID`, `Nombre`, `Apellido`, `Email`, `PasswordHash`, `Rol`, `Estado`, `IntentosFallidos`, `UltimoIntento`, `BloqueadoHasta`, `UltimoAcceso`, `FechaRegistro`, `FechaActualizacion`, `TokenRecuperacion`, `TokenExpiracion`) VALUES
(1, 'Juan', 'Pérez', 'juan@test.com', '$2b$10$/5TZ4MBC/OSmZBGoxr4yYOZ5L9UP.00.7nk0igblcyU2PK8NU7R/.', 'Cliente', 'Activo', 0, NULL, NULL, '2026-09-05 04:04:04', '2026-09-05 04:03:15', '2026-09-05 04:04:04', NULL, NULL),
(2, 'Alejandro', 'Sarmietno', 'alejandrosarmientosuarez@gmail.com', '$2b$10$NmLM0eblXAUDNtrzAQTpSuN/.ZEKdb2fHC9dBlucYh7WK1JuI5Sk.', 'Cliente', 'Activo', 1, '2026-09-12 13:50:15', NULL, '2026-09-06 02:24:52', '2026-09-05 04:15:53', '2026-09-12 13:50:15', 'e2ce679f77dbe8aa035e8f605f70cd08b858cb433cd84e2333c3c51fbbff7ae1', '2026-09-06 03:32:24'),
(3, 'Alejandro', 'Sarmietno', '123@gmail.com', '$2b$10$5UgnyoddaAo.r.QoZrEmVOhcEowSWuLre8h2siXge9CTM/IM4Gzlu', 'Cliente', 'Activo', 2, '2026-09-12 13:50:24', NULL, '2026-09-07 01:05:55', '2026-09-06 02:25:59', '2026-09-12 13:50:35', '65de208413aa4b3fbc362e27a5565ba296cdda826ed28112a2efda509ce954b3', '2026-09-12 14:20:35'),
(4, 'Alejandro', 'Sarmietno', 'alejandrosarmiento@gmail.com', '$2b$10$h8cqAr6VfKmoHdHAY.eGouRN6kD78MoFTfZP2bME6njC7X8QUatpi', 'Cliente', 'Activo', 0, NULL, NULL, '2026-10-09 01:10:07', '2026-09-12 13:51:01', '2026-10-09 01:10:07', NULL, NULL),
(5, 'pedro', 'wanglin', 'pedrito123@gmail.com', '$2b$10$6zujA3DpjC4HrJ2LVqpge.kQeo8JTetyg9qLWt/4aI/rJ0tp8psC.', 'Cliente', 'Activo', 0, NULL, NULL, '2026-09-18 14:00:42', '2026-09-18 14:00:25', '2026-09-18 14:00:42', NULL, NULL),
(6, 'thomas', 'perez', 'thomas123@gmail.com', '$2b$10$eP.Et8VKs8eDYAS4jDfFSe96lzJ3OIyHsIMfeVasevy9VNarv5/rq', 'Cliente', 'Activo', 3, '2026-09-25 09:10:33', NULL, NULL, '2026-09-25 09:10:09', '2026-09-25 09:10:44', 'd05754bfc922581ab09da2a866f22e856982f394d93efb08a24954e842278032', '2026-09-25 09:40:44'),
(7, 'Alejandro', 'Sarmietno', 'alejandro@gmail.com', '$2b$10$PyoXsLlRkCfWn4oYVxRxQeB.mKgnCDlggxOYOwom201FbWm/VZEs.', 'Admin', 'Activo', 0, NULL, NULL, '2026-10-09 13:07:45', '2026-10-08 10:11:16', '2026-10-09 13:07:45', NULL, NULL),
(8, 'ale', 'suarex', 'ale1234@gmai.com', '$2b$10$bqRuhnTozRzDVmqVbSAkz.tRRd6p0jmYolfX4vfnbGJVkFwPLejdG', 'Cliente', 'Activo', 0, NULL, NULL, NULL, '2026-10-09 01:15:03', '2026-10-09 01:15:03', NULL, NULL),
(9, 'ale', 'suarez', 'ale123@gmail.com', '$2b$10$EbvKbvRmy.Way6.E0txN4ezaiUVwIx7mSfySr/gpE36sStf1N0uYu', 'Cliente', 'Activo', 0, NULL, NULL, '2026-10-09 01:15:48', '2026-10-09 01:15:45', '2026-10-09 01:15:48', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_pedidos`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vw_pedidos` (
`PedidoID` bigint(20) unsigned
,`UsuarioID` int(10) unsigned
,`Cliente` varchar(201)
,`Email` varchar(254)
,`Total` decimal(12,2)
,`Estado` enum('Pendiente','Pagado','Enviado','Entregado','Cancelado')
,`FechaCreacion` timestamp
,`FechaPago` timestamp
,`FechaEnvio` timestamp
,`FechaEntrega` timestamp
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_productos_disponibles`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vw_productos_disponibles` (
`ProductoID` int(10) unsigned
,`Nombre` varchar(150)
,`Descripcion` text
,`Imagen` varchar(255)
,`Precio` decimal(12,2)
,`StockActual` int(11)
,`StockMaximo` int(10) unsigned
,`Estado` enum('Disponible','PocasUnidades','Agotado','Inactivo')
,`Destacado` tinyint(1)
,`FechaCreacion` timestamp
,`FechaActualizacion` timestamp
);

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_pedidos`
--
DROP TABLE IF EXISTS `vw_pedidos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_pedidos`  AS SELECT `p`.`PedidoID` AS `PedidoID`, `p`.`UsuarioID` AS `UsuarioID`, concat(`u`.`Nombre`,' ',`u`.`Apellido`) AS `Cliente`, `u`.`Email` AS `Email`, `p`.`Total` AS `Total`, `p`.`Estado` AS `Estado`, `p`.`FechaCreacion` AS `FechaCreacion`, `p`.`FechaPago` AS `FechaPago`, `p`.`FechaEnvio` AS `FechaEnvio`, `p`.`FechaEntrega` AS `FechaEntrega` FROM (`pedidos` `p` join `usuarios` `u` on(`p`.`UsuarioID` = `u`.`UsuarioID`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_productos_disponibles`
--
DROP TABLE IF EXISTS `vw_productos_disponibles`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_productos_disponibles`  AS SELECT `productos`.`ProductoID` AS `ProductoID`, `productos`.`Nombre` AS `Nombre`, `productos`.`Descripcion` AS `Descripcion`, `productos`.`Imagen` AS `Imagen`, `productos`.`Precio` AS `Precio`, `productos`.`StockActual` AS `StockActual`, `productos`.`StockMaximo` AS `StockMaximo`, `productos`.`Estado` AS `Estado`, `productos`.`Destacado` AS `Destacado`, `productos`.`FechaCreacion` AS `FechaCreacion`, `productos`.`FechaActualizacion` AS `FechaActualizacion` FROM `productos` WHERE `productos`.`Estado` <> 'Inactivo' AND `productos`.`StockActual` > 0 ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`AuditoriaID`),
  ADD KEY `idx_auditoria_usuario` (`UsuarioID`),
  ADD KEY `idx_auditoria_fecha` (`Fecha`),
  ADD KEY `idx_auditoria_tabla` (`TablaAfectada`),
  ADD KEY `idx_auditoria_accion` (`Accion`);

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`CarritoID`),
  ADD KEY `idx_carrito_usuario` (`UsuarioID`),
  ADD KEY `idx_carrito_estado` (`Estado`),
  ADD KEY `idx_carrito_usuario_estado` (`UsuarioID`,`Estado`);

--
-- Indices de la tabla `carrito_detalle`
--
ALTER TABLE `carrito_detalle`
  ADD PRIMARY KEY (`CarritoDetalleID`),
  ADD UNIQUE KEY `uq_carrito_producto` (`CarritoID`,`ProductoID`),
  ADD KEY `idx_carrito_detalle_producto` (`ProductoID`);

--
-- Indices de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD PRIMARY KEY (`DetallePedidoID`),
  ADD UNIQUE KEY `uq_pedido_producto` (`PedidoID`,`ProductoID`),
  ADD KEY `idx_detalle_producto` (`ProductoID`);

--
-- Indices de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD PRIMARY KEY (`FavoritoID`),
  ADD UNIQUE KEY `uq_usuario_producto_favorito` (`UsuarioID`,`ProductoID`),
  ADD KEY `idx_favoritos_producto` (`ProductoID`);

--
-- Indices de la tabla `movimientos_stock`
--
ALTER TABLE `movimientos_stock`
  ADD PRIMARY KEY (`MovimientoID`),
  ADD KEY `idx_stock_producto` (`ProductoID`),
  ADD KEY `idx_stock_fecha` (`Fecha`),
  ADD KEY `idx_stock_producto_fecha` (`ProductoID`,`Fecha`);

--
-- Indices de la tabla `newsletter`
--
ALTER TABLE `newsletter`
  ADD PRIMARY KEY (`NewsletterID`),
  ADD UNIQUE KEY `uq_newsletter_email` (`Email`),
  ADD KEY `idx_newsletter_estado` (`Estado`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`PedidoID`),
  ADD KEY `idx_pedido_usuario` (`UsuarioID`),
  ADD KEY `idx_pedido_estado` (`Estado`),
  ADD KEY `idx_pedido_fecha` (`FechaCreacion`),
  ADD KEY `idx_pedido_usuario_fecha` (`UsuarioID`,`FechaCreacion`),
  ADD KEY `idx_pedido_estado_fecha` (`Estado`,`FechaCreacion`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`ProductoID`),
  ADD KEY `idx_producto_nombre` (`Nombre`),
  ADD KEY `idx_producto_estado` (`Estado`),
  ADD KEY `idx_producto_precio` (`Precio`),
  ADD KEY `idx_producto_destacado` (`Destacado`),
  ADD KEY `idx_producto_stock` (`StockActual`),
  ADD KEY `idx_producto_busqueda` (`Estado`,`Destacado`,`Precio`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`UsuarioID`),
  ADD UNIQUE KEY `uq_usuario_email` (`Email`),
  ADD KEY `idx_usuario_estado` (`Estado`),
  ADD KEY `idx_usuario_rol` (`Rol`),
  ADD KEY `idx_usuario_bloqueado` (`BloqueadoHasta`),
  ADD KEY `idx_usuario_token` (`TokenRecuperacion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  MODIFY `AuditoriaID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `CarritoID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `carrito_detalle`
--
ALTER TABLE `carrito_detalle`
  MODIFY `CarritoDetalleID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  MODIFY `DetallePedidoID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  MODIFY `FavoritoID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `movimientos_stock`
--
ALTER TABLE `movimientos_stock`
  MODIFY `MovimientoID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `newsletter`
--
ALTER TABLE `newsletter`
  MODIFY `NewsletterID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `PedidoID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `ProductoID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `UsuarioID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD CONSTRAINT `fk_auditoria_usuario` FOREIGN KEY (`UsuarioID`) REFERENCES `usuarios` (`UsuarioID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `fk_carrito_usuario` FOREIGN KEY (`UsuarioID`) REFERENCES `usuarios` (`UsuarioID`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `carrito_detalle`
--
ALTER TABLE `carrito_detalle`
  ADD CONSTRAINT `fk_carrito_detalle_carrito` FOREIGN KEY (`CarritoID`) REFERENCES `carrito` (`CarritoID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_carrito_detalle_producto` FOREIGN KEY (`ProductoID`) REFERENCES `productos` (`ProductoID`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD CONSTRAINT `fk_detalle_pedido_pedido` FOREIGN KEY (`PedidoID`) REFERENCES `pedidos` (`PedidoID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detalle_pedido_producto` FOREIGN KEY (`ProductoID`) REFERENCES `productos` (`ProductoID`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD CONSTRAINT `fk_favoritos_producto` FOREIGN KEY (`ProductoID`) REFERENCES `productos` (`ProductoID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_favoritos_usuario` FOREIGN KEY (`UsuarioID`) REFERENCES `usuarios` (`UsuarioID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `movimientos_stock`
--
ALTER TABLE `movimientos_stock`
  ADD CONSTRAINT `fk_movimientos_stock_producto` FOREIGN KEY (`ProductoID`) REFERENCES `productos` (`ProductoID`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `fk_pedidos_usuario` FOREIGN KEY (`UsuarioID`) REFERENCES `usuarios` (`UsuarioID`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
