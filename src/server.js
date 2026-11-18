import express from "express";
import path from "node:path";
import { envs } from "./config/env.js";
import { connection } from "./ORM/database/db_config.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {
  leerCookieCliente,
} from "./middlewares.js";
import rutasCliente from "./routes/rutasCliente.js";
import rutasProductos from "./routes/rutasProductos.js";
import rutasVistas from "./routes/rutasViews.js";
import rutasCarrito from "./routes/rutasCarrito.js";
import rutasModo from "./routes/rutasModo.js";
import rutasVentas from "./routes/rutasVentas.js";
import rutasAdmin from "./routes/rutasAdmin.js";
import rutasImagenes from "./routes/rutasImagenes.js";



const app = express();

//======DEFINICION DE PATHS======
const __dirname = import.meta.dirname;
const carpetaRaiz = path.join(__dirname, "..");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); //estoy seteando cors como middleware para todas las solicitudes
app.use(cookieParser());
app.use(leerCookieCliente);

// Configurar EJS como motor de vistas
app.set("view engine", "ejs");

app.set("views", path.join(carpetaRaiz, "views"));

// Carpeta para archivos públicos (CSS, imágenes, etc.)
app.use("/public", express.static(path.join(carpetaRaiz, "public")));
// Carpeta para archivos JS
app.use("/js", express.static(path.join(__dirname, "js")));


//=======ENDPOINTS VISTAS========

app.use(rutasVistas);

//=======ENDPOINTS PRODUCTO========

app.use(rutasProductos);

//=======ENDPOINTS CLIENTE========
app.use(rutasCliente);

//==== ENDPOINS IMAGENES ====

app.use(rutasImagenes);

//=======ENDPOINTS CARRITO==========

app.use(rutasCarrito);

//====ENDPOINTS TICKET=====

app.use(rutasVentas);


//=====ENDPOINTS MODO======

app.use(rutasModo);

// ENDPOINTS Admin //

app.use(rutasAdmin);

try {
  await connection.authenticate();
  connection.sync({});
} catch (error) {
  console.error(error);
}

app.listen(envs.port, () => {
  console.log(`El servidor está escuchando en el puerto ${process.env.PORT}`);
});
