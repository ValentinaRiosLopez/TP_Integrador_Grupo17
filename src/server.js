import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { envs } from "./config/env.js";
import { connection } from "./config/db_config.js";
import Productos from "./modelos/productos.js";
import Usuarios from "./modelos/usuarios.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import multer from 'multer';
import { setearCookieCliente, setearCookieDeAutorizacion,leerCookieCliente, requerirCliente } from "./middlewares.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); //estoy seteando cors como middleware para todas las solicitudes
app.use(cookieParser());
app.use(leerCookieCliente);

const __dirname = import.meta.dirname;
const carpetaRaiz = path.join(__dirname, "..")

// Configurar EJS como motor de vistas
app.set("view engine", "ejs");

/*
Docs de express:
https://expressjs.com/en/5x/guide/using-template-engines/
"views, the directory where the template files are located. 
Eg: app.set('views', './views'). 
This defaults to the views directory in the application root directory."
*/
app.set("views", path.join(carpetaRaiz, "views"));

// Carpeta para archivos públicos (CSS, imágenes, etc.)
app.use("/public", express.static(path.join(carpetaRaiz, "public")));
// Carpeta para archivos JS
app.use("/js", express.static(path.join(__dirname, "js")));


//======Funciones get productos=========
//traigo los productos de la base de datos
//despues capaz las cambio todas a una sola funcion que sea reutilizable
async function getProductos() {
  try {
    const productos = await Productos.findAll({
      where: {
        activo: true,
      },
    });

    return productos
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getJuegos() {
  try {
    const productos = await Productos.findAll({
      where: {
        activo: true,
        tipo: "juego"
      },
    });

    return productos
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getDados() {
  try {
    const productos = await Productos.findAll({
      where: {
        activo: true,
        tipo: "dado"
      },
    });

    return productos
  } catch (error) {
    console.error(error);
    return null;
  }
}

// RUTAS

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/productos", requerirCliente ,async (req, res) => {
  const productos = await getProductos();
  if (!productos) return res.status(500).send("Error al obtener productos");
  res.render("productos", {productos});
});

app.get("/productos/juegos", requerirCliente ,async (req, res) => {
  const productos = await getJuegos();
  if (!productos) return res.status(500).send("Error al obtener productos");
  res.render("productos", {productos});
});

app.get("/productos/dados", requerirCliente ,async (req, res) => {
  const productos = await getDados();
  if (!productos) return res.status(500).send("Error al obtener productos");
  res.render("productos", {productos});
});

app.get("/carrito", requerirCliente , (req, res) => {
  res.render("carrito");
});

app.get("/ticket", requerirCliente ,(req, res) => {
  res.render("ticket");
});

app.get("/admin/login", (req, res) => {
  res.render("admin/login");
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

const verificarCampoRequerido = (campo, nombreCampo, res) => {
  if (!campo) {
    res.status(400).json({
      error: `El campo '${nombreCampo}' es requerido`,
    });
  }
};


//Alta cliente
//le setea la cookie y reenderiza la pagina sin el login
app.post("/", setearCookieCliente, (req, res) => {
  res.redirect("/"); 
});

//Baja cliente
//borra la cookie y vuelve a mostrar el login 
app.post("/salir", (req, res) => {
  res.clearCookie("cliente", { path: "/" });
  res.redirect("/");
});

// ENDPOINTS Admin //
// Alta de usuarios
app.post("/api/admin/altaUsuario", async (req, res) => {
  try {
    const { nombre = "", email = "", password = "" } = req.body;

    if (!nombre) return verificarCampoRequerido(nombre, "nombre", res);
    if (!email) return verificarCampoRequerido(email, "email", res);
    if (!password) return verificarCampoRequerido(password, "password", res);

    const usuarioExistente = await Usuarios.findOne({
      where: {
        email: email,
      },
    });

    if (usuarioExistente) {
      res.status(409).json({
        // 409 Conflict HTTP status code.
        error: "El usuario ya existe",
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const crearUsuario = await Usuarios.create({
      nombre: nombre,
      email: email,
      password_hash: passwordHash,
    });

    return res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: {
        id: crearUsuario.id,
        nombre: crearUsuario.nombre,
        email: crearUsuario.email,
      },
    }); // 201 Created HTTP status code.
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al intentar crear usuario",
    });
  }
});

// Login de usuarios
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email = "", password = "" } = req.body;

    if (!email) return verificarCampoRequerido(email, "email", res);
    if (!password) return verificarCampoRequerido(password, "password", res);

    const noAutorizado = () => {
      return res.status(401).json({
        // 401 Unauthorized HTTP status code.
        error: "Credenciales inválidas",
      });
    };

    const usuarioExistente = await Usuarios.findOne({
      where: {
        email: email,
      },
    });

    if (!usuarioExistente) {
      return noAutorizado();
    }

    const validacionDeContrasena = await bcrypt.compare(
      password,
      usuarioExistente.password_hash,
    );

    if (!validacionDeContrasena) {
      return noAutorizado();
    }

    setearCookieDeAutorizacion(
      {
        body: {
          name: usuarioExistente.nombre,
          email: email,
          id: usuarioExistente.id,
        },
      },
      res,
      () => {},
    );

    return res.status(200).json({
      mensaje: "Usuario logueado correctamente",
      usuario: {
        nombre: usuarioExistente.nombre,
        email: usuarioExistente.email,
      },
    }); // 200 OK HTTP status code.
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al intentar loguear usuario",
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
