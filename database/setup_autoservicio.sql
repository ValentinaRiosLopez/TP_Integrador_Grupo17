-- TP Integrador Programacion III - Autoservicio
-- Para MySQL / MariaDB (XAMPP)
-- Importar desde phpMyAdmin > Importar, o ejecutar:
-- mysql -u root -p < setup_autoservicio.sql
-- Idempotente para tablas y juegos de ejemplo. No borra registros existentes.

-- PASO A PASO
-- Cómo ejecutarlo en cada computadora

-- Paso 1. Iniciar MySQL
-- Abrí XAMPP y encendé MySQL.

-- Paso 2. Abrir phpMyAdmin
-- Entrá a http://localhost/phpmyadmin.

-- Paso 3. Importar el SQL
-- Desde la pantalla principal de phpMyAdmin, seleccioná Importar, elegí setup_autoservicio.sql y presioná Continuar.

CREATE DATABASE IF NOT EXISTS autoservicio
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE autoservicio;

-- Tabla 1: productos
CREATE TABLE IF NOT EXISTS productos (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(500) NULL,
    precio DECIMAL(10,2) NOT NULL,
    imagen VARCHAR(255) NULL,
    categoria VARCHAR(50) NOT NULL,
    tipo ENUM('juego', 'dado', 'accesorio') NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT chk_productos_precio CHECK (precio >= 0)
) ENGINE=InnoDB;

-- Tabla 2: usuarios administradores
CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB;

-- Tabla 3: ventas
CREATE TABLE IF NOT EXISTS ventas (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre_cliente VARCHAR(100) NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(12,2) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT chk_ventas_total CHECK (total >= 0)
) ENGINE=InnoDB;

-- Tabla 4: detalle_ventas (N:M entre ventas y productos)
CREATE TABLE IF NOT EXISTS detalle_ventas (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    venta_id INT UNSIGNED NOT NULL,
    producto_id INT UNSIGNED NOT NULL,
    cantidad INT UNSIGNED NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_detalle_venta_producto (venta_id, producto_id),
    CONSTRAINT fk_detalle_venta FOREIGN KEY (venta_id)
        REFERENCES ventas (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id)
        REFERENCES productos (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_detalle_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_detalle_precio CHECK (precio_unitario >= 0)
) ENGINE=InnoDB;

-- Productos de ejemplo. No se insertan otra vez si ya existe
-- un producto con el mismo nombre y tipo.
INSERT INTO productos
    (nombre, descripcion, precio, imagen, categoria, tipo, activo)
SELECT
    ejemplos.nombre, ejemplos.descripcion, ejemplos.precio,
    NULL, 'Juegos de mesa', 'juego', TRUE
FROM (
    SELECT 'Catan' AS nombre,
           'Juego de estrategia y comercio para 3 a 4 jugadores.' AS descripcion,
           65000.00 AS precio
    UNION ALL SELECT 'Carcassonne', 'Juego de colocación de losetas y construcción de ciudades.', 48000.00
    UNION ALL SELECT 'Dixit', 'Juego de creatividad, imaginación y asociación de imágenes.', 55000.00
    UNION ALL SELECT 'Azul', 'Juego de estrategia y colocación de azulejos.', 59000.00
    UNION ALL SELECT 'Ticket to Ride', 'Juego de estrategia basado en la construcción de rutas ferroviarias.', 78000.00
    UNION ALL SELECT 'Dobble', 'Juego de rapidez visual y reconocimiento de símbolos.', 25000.00
    UNION ALL SELECT 'Exploding Kittens', 'Juego de cartas de estrategia, humor y eliminación.', 32000.00
    UNION ALL SELECT 'Código Secreto', 'Juego de palabras, deducción y trabajo en equipo.', 38000.00
    UNION ALL SELECT 'Virus!', 'Juego de cartas donde los jugadores compiten por completar un cuerpo sano.', 23000.00
    UNION ALL SELECT 'Kingdomino', 'Juego de estrategia y construcción de reinos mediante fichas de dominó.', 42000.00
) AS ejemplos
WHERE NOT EXISTS (
    SELECT 1
    FROM productos AS p
    WHERE p.nombre = ejemplos.nombre AND p.tipo = 'juego'
);

-- Verificación rápida (opcional):
-- SHOW TABLES;
-- SELECT id, nombre, precio, tipo, activo FROM productos;
