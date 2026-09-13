SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE usuarios (
    UsuarioID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Estado ENUM('Activo','Bloqueado') DEFAULT 'Activo',
    FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UltimoAcceso TIMESTAMP NULL
);

CREATE TABLE productos (
    ProductoID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Imagen VARCHAR(255),
    Precio DECIMAL(10,2) NOT NULL,
    StockActual INT NOT NULL DEFAULT 0,
    StockMaximo INT NOT NULL DEFAULT 50,
    Estado ENUM('Disponible','PocasUnidades','Agotado') DEFAULT 'Disponible',
    Destacado BOOLEAN DEFAULT FALSE,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CHECK (Precio > 0),
    CHECK (Precio <= 500000),
    CHECK (StockActual >= 0),
    CHECK (StockActual <= StockMaximo)
);

CREATE TABLE newsletter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    edad INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (edad >= 13),
    CHECK (edad <= 120)
);

CREATE TABLE carrito (
    CarritoID INT AUTO_INCREMENT PRIMARY KEY,
    UsuarioID INT NOT NULL,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (UsuarioID)
    REFERENCES usuarios(UsuarioID)
    ON DELETE CASCADE
);

CREATE TABLE carrito_detalle (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    CarritoID INT NOT NULL,
    ProductoID INT NOT NULL,
    Cantidad INT NOT NULL,

    CHECK (Cantidad > 0),

    FOREIGN KEY (CarritoID)
    REFERENCES carrito(CarritoID)
    ON DELETE CASCADE,

    FOREIGN KEY (ProductoID)
    REFERENCES productos(ProductoID)
    ON DELETE CASCADE
);

CREATE TABLE pedidos (
    PedidoID INT AUTO_INCREMENT PRIMARY KEY,
    UsuarioID INT NOT NULL,
    Total DECIMAL(10,2) NOT NULL,

    Estado ENUM(
        'Pendiente',
        'Pagado',
        'Enviado',
        'Entregado',
        'Cancelado'
    ) DEFAULT 'Pendiente',

    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (UsuarioID)
    REFERENCES usuarios(UsuarioID)
    ON DELETE CASCADE
);

CREATE TABLE detalle_pedido (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    PedidoID INT NOT NULL,
    ProductoID INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (PedidoID)
    REFERENCES pedidos(PedidoID)
    ON DELETE CASCADE,

    FOREIGN KEY (ProductoID)
    REFERENCES productos(ProductoID)
    ON DELETE CASCADE
);

CREATE TABLE favoritos (
    FavoritoID INT AUTO_INCREMENT PRIMARY KEY,
    UsuarioID INT NOT NULL,
    ProductoID INT NOT NULL,

    FOREIGN KEY (UsuarioID)
    REFERENCES usuarios(UsuarioID)
    ON DELETE CASCADE,

    FOREIGN KEY (ProductoID)
    REFERENCES productos(ProductoID)
    ON DELETE CASCADE
);

INSERT INTO productos (Nombre, Descripcion, Imagen, Precio, StockActual, StockMaximo, Estado, Destacado) VALUES
('Camisa minimalista', 'Camisa de algodón con detalles minimalistas.', '../img/producto1.jpg', 24990.00, 15, 50, 'Disponible', TRUE),
('Pantalones suaves', 'Pantalones de corte recto y tela suave.', '../img/producto2.jpg', 29990.00, 12, 50, 'Disponible', FALSE),
('Chaqueta versátil', 'Chaqueta ligera ideal para cualquier ocasión.', '../img/producto3.jpg', 34990.00, 10, 50, 'Disponible', TRUE),
('Vestido elegante', 'Vestido elegante para eventos especiales.', '../img/producto4.jpg', 39990.00, 8, 50, 'Disponible', FALSE),
('Suéter acogedor', 'Suéter de lana suave ideal para climas fríos.', '../img/foto1A.jpg', 27990.00, 10, 50, 'Disponible', FALSE),
('Camiseta básica', 'Camiseta de algodón ligera y cómoda para uso diario.', '../img/foto2A.jpg', 14990.00, 25, 50, 'Disponible', FALSE),
('Blazer elegante', 'Blazer moderno perfecto para eventos formales o de oficina.', '../img/foto3A.jpg', 44990.00, 6, 50, 'Disponible', TRUE),
('Sudadera casual', 'Sudadera con capucha y bolsillo frontal, ideal para un look urbano.', '../img/foto4A.jpg', 22990.00, 20, 50, 'Disponible', FALSE),
('Shorts frescos', 'Shorts de algodón para días cálidos y estilo relajado.', '../img/foto5A.jpg', 19990.00, 30, 50, 'Disponible', FALSE),
('Abrigo clásico', 'Abrigo largo con corte moderno para la temporada invernal.', '../img/foto6A.jpg', 54990.00, 5, 50, 'PocasUnidades', TRUE),
('Chaqueta de Cuero', 'Chaqueta cómoda y negra de hombre con un estilo rockero.', '../img/foto8A.jpg', 59990.00, 4, 50, 'PocasUnidades', TRUE),
('Traje Azul Elegante', 'Traje azul moderno y elegante, ideal para eventos especiales.', '../img/foto9A.jpg', 89990.00, 3, 50, 'PocasUnidades', TRUE),
('Bufanda moderna', 'Bufanda de lana tejida, perfecta para complementar tu outfit.', '../img/foto10A.jpg', 12990.00, 40, 50, 'Disponible', FALSE),
('Camisa Negra', 'Camisa negra de hombre moderna y ajustada al cuerpo.', '../img/foto11A.jpg', 26990.00, 10, 50, 'Disponible', FALSE),
('Pantalon de Vestir', 'Pantalón de vestir azul oscuro moderno.', '../img/foto12A.jpg', 34990.00, 7, 50, 'Disponible', FALSE);

DELIMITER $$

CREATE TRIGGER trg_control_stock
BEFORE UPDATE ON productos
FOR EACH ROW
BEGIN
    IF NEW.StockActual < 0 THEN
        SET NEW.StockActual = 0;
    END IF;

    IF NEW.StockActual = 0 THEN
        SET NEW.Estado = 'Agotado';
    ELSEIF NEW.StockActual <= 5 THEN
        SET NEW.Estado = 'PocasUnidades';
    ELSE
        SET NEW.Estado = 'Disponible';
    END IF;
END$$

ALTER TABLE usuarios
ADD Rol ENUM('Admin','Cliente') DEFAULT 'Cliente';

ALTER TABLE usuarios
ADD IntentosFallidos INT DEFAULT 0;

ALTER TABLE usuarios
ADD UltimoIntento TIMESTAMP NULL;

DELIMITER ;

CREATE INDEX idx_producto_nombre ON productos(Nombre);
CREATE INDEX idx_producto_estado ON productos(Estado);
CREATE INDEX idx_usuario_email ON usuarios(Email);

COMMIT;