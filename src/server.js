import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { envs } from "./config/env.js";
import { connection } from "./config/db_config.js";
import Productos from "./modelos/productos.js";

const app = express();

app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configurar EJS como motor de vistas
app.set("view engine", "ejs");

/*
Docs de express:
https://expressjs.com/en/5x/guide/using-template-engines/
"views, the directory where the template files are located. 
Eg: app.set('views', './views'). 
This defaults to the views directory in the application root directory."
*/
app.set("views", path.join(__dirname, "views"));

// Carpeta para archivos públicos (CSS, imágenes, etc.)
app.use("/recursos", express.static(path.join(__dirname, "recursos")));
// Carpeta para archivos JS
app.use("/js", express.static(path.join(__dirname, "js")));

// RUTAS

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/productos", (req, res) => {
  res.render("productos");
});

app.get("/productos/juegos", (req, res) => {
  res.render("productos");
});

app.get("/productos/dados", (req, res) => {
  res.render("productos");
});

app.get("/carrito", (req, res) => {
  res.render("carrito");
});

app.get("/ticket", (req, res) => {
  res.render("ticket");
});

// ENDPOINTS

app.get("/api/productos", async (req, res) => {
  try {
    const productos = await Productos.findAll({
      where: {
        activo: true,
      },
    });

    res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al obtener productos",
    });
  }
});

try {
  await connection.authenticate();
  connection.sync({});

  // await Alumno.sync();

  // const result = await Alumno.findAll();
  // console.log(result);
} catch (error) {
  console.error(error);
}

// Iniciar servidor
app.listen(envs.port, () => {
  console.log(`El servidor está escuchando en el puerto ${process.env.PORT}`);
});
