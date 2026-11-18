-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-11-2026 a las 11:36:45
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
  `tipo` enum('juego','dado') NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `imagen`, `tipo`, `activo`, `createdAt`, `updatedAt`) VALUES
(1, 'Catan', 'Juego de estrategia y comercio para 3 a 4 jugadores.', 65000.00, '/public/static/imagenes/catan.jpg', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),
(2, 'Carcassonne', 'Juego de colocación de losetas y construcción de ciudades.', 48000.00, '/public/static/imagenes/carcassonne.jpg', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),
(3, 'Dixit', 'Juego de creatividad, imaginación y asociación de imágenes.', 55000.00, '/public/static/imagenes/dixit.jpg', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),
(4, 'Azul', 'Juego de estrategia y colocación de azulejos.', 59000.00, '/public/static/imagenes/azul.jpg', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),
(5, 'Ticket to Ride', 'Juego de estrategia basado en la construcción de rutas ferroviarias.', 78000.00, '/public/static/imagenes/ticket-to-ride.png', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),
(6, 'Dobble', 'Juego de rapidez visual y reconocimiento de símbolos.', 25000.00, '/public/static/imagenes/dobble.jpg', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),
(7, 'Exploding Kittens', 'Juego de cartas de estrategia, humor y eliminación.', 32000.00, '/public/static/imagenes/exploding-kittens.jpg', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),
(8, 'Código Secreto', 'Juego de palabras, deducción y trabajo en equipo.', 38000.00, '/public/static/imagenes/codigo-secreto.jpg', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),
(9, 'Virus!', 'Juego de cartas donde los jugadores compiten por completar un cuerpo sano.', 23000.00, '/public/static/imagenes/virus!.jpg', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),
(10, 'Kingdomino', 'Juego de estrategia y construcción de reinos mediante fichas de dominó.', 42000.00, '/public/static/imagenes/kingdomino.jpg', 'juego', 1, '2026-11-04 16:51:25', '2026-11-06 17:17:35'),
(11, 'Set de Dados de Rol - Amarillo y Negro Especiales', 'Set de dados ideal para juegos de rol como Call of Cthulhu, Dungeons & Dragons, GURPS, Marvel Heroic Roleplaying, Pathfinder, Shadowrun, Vampiro: la Mascarada.', 17900.00, '/public/static/imagenes/b9a57fb6-0e8e-405e-80e9-91dfd341bb2e.jpg', 'dado', 1, '2026-11-18 10:12:35', '2026-11-18 10:12:35'),
(12, 'El Archivo de las Tormentas - Set de dados', 'El set está compuesto por 7 dados necesarios para un jugador para partidas de Dungeons & Dragons y otros juegos de Rol.', 26900.00, '/public/static/imagenes/dba88eb9-48c8-4a76-9b4d-4d0211223a53.jpg', 'dado', 1, '2026-11-18 10:15:36', '2026-11-18 10:15:36'),
(13, 'Set de Dados de Rol - Azul y Cobre Marmolado', 'El set está compuesto por 7 dados necesarios para un jugador para partidas de Dungeons & Dragons y otros juegos de Rol.', 15900.00, '/public/static/imagenes/55171aaf-a44f-4810-a9b9-2dacd240d5d8.jpg', 'dado', 1, '2026-11-18 10:16:19', '2026-11-18 10:16:19'),
(14, 'Set de Dados de Rol - Celeste y Violeta Fosforescentes', 'Set de dados celeste y violeta con números negros, brillan en la oscuridad (se cargan primero poniendolos delante de una lampara y luego brillan)', 17900.00, '/public/static/imagenes/701fc3f8-6990-4525-a61f-e1b9d7ff481b.jpg', 'dado', 1, '2026-11-18 10:17:06', '2026-11-18 10:17:06'),
(15, 'Set de Dados de Rol - Dorado y Rojo Metálicos', 'El set está compuesto por 7 dados necesarios para un jugador para partidas de Dungeons & Dragons y otros juegos de Rol.', 49900.00, '/public/static/imagenes/7a8ede2a-c2e9-45c8-925e-eecfce01d2a4.jpg', 'dado', 1, '2026-11-18 10:18:01', '2026-11-18 10:18:01'),
(16, 'Set de Dados D6 - Azul y Negro Marmolados', 'El set está compuesto por 10 dados de 6 caras.', 9900.00, '/public/static/imagenes/5aab70ca-3bb6-4ec3-991b-84eeefb7296a.jpg', 'dado', 1, '2026-11-18 10:18:46', '2026-11-18 10:18:46'),
(17, 'Set de Dados de Rol - Verde con Glitter', 'El set está compuesto por 7 dados necesarios para un jugador para partidas de Dungeons & Dragons y otros juegos de Rol.', 15900.00, '/public/static/imagenes/f93c2dc5-8d17-4669-80b8-08ddbe55c9a3.jpg', 'dado', 1, '2026-11-18 10:19:47', '2026-11-18 10:19:47'),
(18, 'Set de Dados de Rol - Negro y Azul', 'El set está compuesto por 7 dados necesarios para un jugador para partidas de Dungeons & Dragons y otros juegos de Rol.', 15900.00, '/public/static/imagenes/799a2090-0a32-4a62-91b2-357e46986f98.jpg', 'dado', 1, '2026-11-18 10:21:02', '2026-11-18 10:21:38'),
(19, 'Set de Dados D6 - Naranja Traslúcido', 'El set está compuesto por 10 dados de 6 caras.', 9900.00, '/public/static/imagenes/3a9ecabb-fb30-46b4-accb-a167ff2ed82a.jpg', 'dado', 1, '2026-11-18 10:22:20', '2026-11-18 10:22:20'),
(20, 'Set de Dados de Rol - Rosa con Glitter', 'El set está compuesto por 7 dados necesarios para un jugador para partidas de Dungeons & Dragons y otros juegos de Rol.', 15900.00, '/public/static/imagenes/fc6ad682-5b17-468f-ad24-0c5af9bc87cf.jpg', 'dado', 1, '2026-11-18 10:23:03', '2026-11-18 10:23:03'),
(21, 'Set de Dados de Rol - Verde Marmolado', 'El set está compuesto por 7 dados necesarios para un jugador para partidas de Dungeons & Dragons y otros juegos de Rol.', 15900.00, '/public/static/imagenes/be2382b0-c2c8-48d0-a28f-0376a337576d.jpg', 'dado', 1, '2026-11-18 10:23:50', '2026-11-18 10:23:50'),
(22, 'Set de Dados de Rol - Blanco Especiales', 'El set está compuesto por 7 dados necesarios para un jugador para partidas de Dungeons & Dragons y otros juegos de Rol.', 17900.00, '/public/static/imagenes/662ab704-17ba-4404-a30a-fd1650a2bdc6.jpg', 'dado', 1, '2026-11-18 10:24:23', '2026-11-18 10:24:23'),
(23, 'Set de Dados de Rol - Dorado Metálicos', 'El set está compuesto por 7 dados necesarios para un jugador para partidas de Dungeons & Dragons y otros juegos de Rol.', 49900.00, '/public/static/imagenes/48c7abe4-5c2b-443a-b17b-81051ea00ce1.jpg', 'dado', 1, '2026-11-18 10:25:18', '2026-11-18 10:25:18'),
(24, 'Set de Dados de Rol - Naranja y Amarillo Fosforescentes', 'El set está compuesto por 7 dados necesarios para un jugador para partidas de Dungeons & Dragons y otros juegos de Rol.', 17900.00, '/public/static/imagenes/b377d862-00a3-4845-ad4a-a25658469c60.jpg', 'dado', 1, '2026-11-18 10:25:56', '2026-11-18 10:25:56'),
(25, 'Set de Dados de Rol - Rojo y Blanco Marmolados', 'El set está compuesto por 7 dados necesarios para un jugador para partidas de Dungeons & Dragons y otros juegos de Rol.', 16500.00, '/public/static/imagenes/b28b5db6-4960-427f-8095-fd8badbe18cd.jpg', 'dado', 1, '2026-11-18 10:26:45', '2026-11-18 10:26:45'),
(26, 'Taco Gato Cabra Queso Pizza', 'Juego ideal para sobremesas y cualquier momento con unos minutos libres, ¡Incluso previas! Un Juego rápido y fácil que va a poner a prueba tu poder de concentración y velocidad mental.', 21900.00, '/public/static/imagenes/9e918aea-c7a3-4031-a140-84ea12a28bd7.jpg', 'juego', 1, '2026-11-18 10:27:41', '2026-11-18 10:27:41'),
(27, 'Palabras a Tiempo', 'Juego de palabras que pone a prueba tu rapidez mental y creatividad. Cada ronda comienza con una carta asignada al azar, y los jugadores deben pensar rápidamente en palabras que encajen según las letras disponibles en el tablero antes de que el tiempo se agote.', 32300.00, '/public/static/imagenes/53dd5e51-fbf7-4e8e-bfd8-969cce6e98aa.jpg', 'juego', 1, '2026-11-18 10:28:27', '2026-11-18 10:28:27'),
(28, 'Sushi Go', 'Juego dondeganas puntos combinando cartas. Junta más puntos que los demás y demuestra porque eres el rey del sushi entre tu familia y amigos.', 32990.00, '/public/static/imagenes/fc14741e-d2ee-4033-a7cf-03c8cb70c6eb.jpg', 'juego', 1, '2026-11-18 10:29:08', '2026-11-18 10:29:08'),
(29, 'Zombie Kittens', 'Desencadena el apocalipsis Zombie. Usa las cartas de acción para mover y evitar al Exploding Kitten y levántate entre los muertos con la carta Zombie Kitten para vengarte.', 44990.00, '/public/static/imagenes/2bdf2081-5d4e-4e4e-ac23-0259160845e7.jpg', 'juego', 1, '2026-11-18 10:31:02', '2026-11-18 10:31:02'),
(30, 'Clank!', 'Juego de construcción de mazos. Cada jugador tiene su propio mazo, y construir el tuyo es parte del juego. Comienza cada uno de tus turnos con cinco cartas en tu mano, y las jugarás todas en el orden que elijas.', 123200.00, '/public/static/imagenes/9f030dae-e08e-4ad9-a3fd-f7de29b0996f.jpg', 'juego', 1, '2026-11-18 10:31:40', '2026-11-18 10:31:40');

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

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password_hash`, `createdAt`, `updatedAt`) VALUES
(1, 'Acceso rapido', 'acceso_rapido@ejemplo.com', '$2b$10$hPcmPQhdEnpEv36Puc1XBuCjuoJrWdoT7SAqQANn7MnSm4.UHYJYS', '2026-11-18 05:01:56', '2026-11-18 05:01:56');

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
