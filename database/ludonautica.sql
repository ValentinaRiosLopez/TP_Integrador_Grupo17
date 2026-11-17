-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-11-2026 a las 02:03:02
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ludonautica`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_venta`
--

CREATE TABLE `detalle_venta` (
  `id_venta` int(10) UNSIGNED NOT NULL,
  `id_producto` int(10) UNSIGNED NOT NULL,
  `cantidad` int(10) UNSIGNED NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `categoria` varchar(50) NOT NULL,
  `tipo` enum('juego','dado') NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos`
(`id`, `nombre`, `descripcion`, `precio`, `imagen`, `categoria`, `tipo`, `activo`, `createdAt`, `updatedAt`)
VALUES
(1, 'Catan', 'Juego de estrategia y comercio para 3 a 4 jugadores.', 65000.00, '/public/static/imagenes/catan.jpg', 'Juegos de mesa', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),
(2, 'Carcassonne', 'Juego de colocación de losetas y construcción de ciudades.', 48000.00, '/public/static/imagenes/carcassonne.jpg', 'Juegos de mesa', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),
(3, 'Dixit', 'Juego de creatividad, imaginación y asociación de imágenes.', 55000.00, '/public/static/imagenes/dixit.jpg', 'Juegos de mesa', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),
(4, 'Azul', 'Juego de estrategia y colocación de azulejos.', 59000.00, '/public/static/imagenes/azul.jpg', 'Juegos de mesa', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),
(5, 'Ticket to Ride', 'Juego de estrategia basado en la construcción de rutas ferroviarias.', 78000.00, '/public/static/imagenes/ticket-to-ride.png', 'Juegos de mesa', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),
(6, 'Dobble', 'Juego de rapidez visual y reconocimiento de símbolos.', 25000.00, '/public/static/imagenes/dobble.jpg', 'Juegos de mesa', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),
(7, 'Exploding Kittens', 'Juego de cartas de estrategia, humor y eliminación.', 32000.00, '/public/static/imagenes/exploding-kittens.jpg', 'Juegos de mesa', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),
(8, 'Código Secreto', 'Juego de palabras, deducción y trabajo en equipo.', 38000.00, '/public/static/imagenes/codigo-secreto.jpg', 'Juegos de mesa', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),
(9, 'Virus!', 'Juego de cartas donde los jugadores compiten por completar un cuerpo sano.', 23000.00, '/public/static/imagenes/virus!.jpg', 'Juegos de mesa', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),
(10, 'Kingdomino', 'Juego de estrategia y construcción de reinos mediante fichas de dominó.', 42000.00, '/public/static/imagenes/kingdomino.jpg', 'Juegos de mesa', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),

(11, 'Dado D4', 'Dado de 4 caras ideal para juegos de rol y aventuras.', 3500.00, '/public/static/imagenes/dado-d4.jpg', 'Dados', 'dado', 1, NOW(), NOW()),
(12, 'Dado D6', 'Dado clásico de 6 caras para juegos de mesa.', 2500.00, '/public/static/imagenes/dado-d6.jpg', 'Dados', 'dado', 1, NOW(), NOW()),
(13, 'Dado D8', 'Dado de 8 caras para juegos de rol y estrategia.', 3500.00, '/public/static/imagenes/dado-d8.jpg', 'Dados', 'dado', 1, NOW(), NOW()),
(14, 'Dado D10', 'Dado de 10 caras para juegos de rol y cálculos de probabilidades.', 4000.00, '/public/static/imagenes/dado-d10.jpg', 'Dados', 'dado', 1, NOW(), NOW()),
(15, 'Dado D12', 'Dado de 12 caras ideal para juegos de rol.', 4500.00, '/public/static/imagenes/dado-d12.jpg', 'Dados', 'dado', 1, NOW(), NOW()),
(16, 'Dado D20', 'Dado de 20 caras utilizado en juegos de rol como Dungeons & Dragons.', 6000.00, '/public/static/imagenes/dado-d20.jpg', 'Dados', 'dado', 1, NOW(), NOW()),
(17, 'Set de 7 dados para rol', 'Set de 7 dados de diferentes caras para juegos de rol y aventuras.', 22000.00, '/public/static/imagenes/set-rol.jpg', 'Dados', 'dado', 1, NOW(), NOW());

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre_cliente` varchar(100) NOT NULL,
  `fecha` datetime NOT NULL,
  `total` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD PRIMARY KEY (`id_venta`,`id_producto`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_usuarios_email` (`email`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD CONSTRAINT `detalle_venta_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detalle_venta_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
