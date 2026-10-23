import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = 3000;
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

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/productos", (req, res) => {
  res.render("productos");
});

app.get("/carrito", (req, res) => {
  res.render("carrito");
});

app.get("/ticket", (req, res) => {
  res.render("ticket");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
