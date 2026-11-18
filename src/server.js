import express from "express";
import path from "node:path";
import { envs } from "./config/env.js";
import { connection } from "./ORM/database/db_config.js";
import Productos from "./ORM/modelos/productos.js";
import Usuarios from "./ORM/modelos/usuarios.js";
import Ventas from "./ORM/modelos/ventas.js";
import DetalleVenta from "./ORM/modelos/detalleVenta.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import multer from "multer";
import {
  setearCookieDeAutorizacion,
  requerirAutorizacion,
  setearCookieCliente,
  emitirCookieCliente,
  leerCookieCliente,
  requerirCliente,
  requerirClienteApi,
  verificarCamposRequeridos,
  validarSesionActiva,
  leerCarrito,
  guardarCarrito,
  requerirCompra,
  requerirCompraApi,
  requerirSinCompra, 
  requerirSinCompraApi,
  guardarModo,
  leerModo,
  validarDatosProducto,
  validarIdProducto,
} from "./middlewares.js";
import puppeteer from "puppeteer";
import ejs from "ejs";
import rutasCliente from "./routes/rutasCliente.js";
import rutasProductos from "./routes/rutasProductos.js";
import rutasVistas from "./routes/rutasViews.js";
import rutasCarrito from "./routes/rutasCarrito.js";
import rutasModo from "./routes/rutasModo.js";
import rutasVentas from "./routes/rutasVentas.js"



const app = express();

const __dirname = import.meta.dirname;
const carpetaRaiz = path.join(__dirname, "..");

//setup para subir imagenes
const storage = multer.diskStorage({
  destination: path.join(carpetaRaiz, "public", "static", "imagenes"),
  filename: (req, file, call) => {
    const nombreUnico = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    call(null, nombreUnico + ext);
  },
});

const fileFilter = (req, file, call) => {
  const tiposValidos = ["image/jpeg", "image/png"];
  if (tiposValidos.includes(file.mimetype)) {
    call(null, true);
  } else {
    call(new Error("Tipo de archivo invalido."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); //estoy seteando cors como middleware para todas las solicitudes
app.use(cookieParser());
app.use(leerCookieCliente);

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
//=======ENDPOINTS VISTAS========

app.use(rutasVistas);

//=======ENDPOINTS PRODUCTO========

app.use(rutasProductos);

//=======ENDPOINTS CLIENTE========
app.use(rutasCliente);

//==== ENDPOINS IMAGENES ====

//guarda imagen en la base de datos
app.post(
  "/subirImagen",
  requerirAutorizacion,
  upload.single("imagen"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No se subio ninguna imagen" });
    }

    //aca armo el string del url de la imagen
    const nombreFile = req.file.filename;
    const rutaImg = `/public/static/imagenes/${nombreFile}`;

    //aca añadimos el url al producto

    res.status(201).json({ imagen: rutaImg });
  },
);

//funcion leer carrito



//=======ENDPOINTS CARRITO==========

app.use(rutasCarrito);

//RELACIONES VENTAS
Ventas.hasMany(DetalleVenta, { foreignKey: "id_venta", as: "detalles" });
DetalleVenta.belongsTo(Ventas, { foreignKey: "id_venta" });

DetalleVenta.belongsTo(Productos, {
  foreignKey: "id_producto",
  as: "producto",
});
Productos.hasMany(DetalleVenta, { foreignKey: "id_producto" });

//====ENDPOINTS TICKET=====

app.use(rutasVentas);


//=====ENDPOINTS MODO======

app.use(rutasModo);

// ENDPOINTS Admin //
// Alta de usuarios
app.post(
  "/api/admin/altaUsuario",
  verificarCamposRequeridos("nombre", "email", "password"),
  async (req, res) => {
    try {
      const { nombre = "", email = "", password = "" } = req.body;

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
  },
);

// Login de usuarios
app.post(
  "/api/admin/login",
  validarSesionActiva,
  verificarCamposRequeridos("email", "password"),
  async (req, res) => {
    try {
      const { email = "", password = "" } = req.body;

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

      req.usuarioAutenticado = usuarioExistente;

      await setearCookieDeAutorizacion(req, res);

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
  },
);

app.post(
  "/api/admin/productos",
  requerirAutorizacion,
  validarDatosProducto,
  async (req, res) => {
    try {
      const productoNuevo = await Productos.create({
        ...req.productoValidado,
        activo: true,
      });

      return res.status(201).json({
        mensaje: "Producto creado correctamente",
        producto: productoNuevo,
      });
    } catch (error) {
      console.error("Error al crear producto:", error);

      return res.status(500).json({
        error: "Error al crear el producto",
      });
    }
  },
);

app.get(
  "/api/admin/productos/:id",
  requerirAutorizacion,
  validarIdProducto,
  async (req, res) => {
    try {
      const producto = await Productos.findByPk(req.productoId);

      if (!producto) {
        return res.status(404).json({
          error: "Producto no encontrado",
        });
      }

      return res.status(200).json(producto);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Error al obtener el producto",
      });
    }
  },
);

app.put(
  "/api/admin/productos/:id",
  requerirAutorizacion,
  validarIdProducto,
  validarDatosProducto,
  async (req, res) => {
    try {
      const producto = await Productos.findByPk(req.productoId);

      if (!producto) {
        return res.status(404).json({
          error: "Producto no encontrado",
        });
      }

      await producto.update({
        ...req.productoValidado,
      });

      return res.status(200).json({
        mensaje: "Producto modificado correctamente",
        producto,
      });
    } catch (error) {
      console.error("Error al modificar producto:", error);

      return res.status(500).json({
        error: "Error al modificar producto",
      });
    }
  },
);

app.delete(
  "/api/admin/productos/:id",
  requerirAutorizacion,
  validarIdProducto,
  async (req, res) => {
    try {
      const producto = await Productos.findByPk(req.productoId);

      if (!producto) {
        return res.status(404).json({
          error: "Producto no encontrado",
        });
      }

      if (!producto.activo) {
        return res.status(409).json({
          error: "El producto ya está desactivado",
        });
      }

      await producto.update({
        activo: false,
      });

      return res.status(200).json({
        mensaje: "Producto desactivado correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar producto:", error);

      return res.status(500).json({
        error: "Error al eliminar el producto",
      });
    }
  },
);

app.put(
  "/api/admin/productos/:id/activar",
  requerirAutorizacion,
  validarIdProducto,
  async (req, res) => {
    try {
      const producto = await Productos.findByPk(req.productoId);

      if (!producto) {
        return res.status(404).json({
          error: "Producto no encontrado",
        });
      }

      if (producto.activo) {
        return res.status(409).json({
          error: "El producto ya está activo",
        });
      }

      await producto.update({
        activo: true,
      });

      return res.status(200).json({
        mensaje: "Producto disponibilizado correctamente",
      });
    } catch (error) {
      console.error("Error al activar producto:", error);

      return res.status(500).json({
        error: "Error al activar el producto",
      });
    }
  },
);


app.get("/admin/historico-ventas", requerirAutorizacion, async (req, res) => {
  try {
    const ventas = await Ventas.findAll({
      include: [
        {
          model: DetalleVenta,
          as: "detalles",
          include: [
            {
              model: Productos,
              as: "producto",
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    return res.render("admin/historicoVentas", {
      titulo: "Histórico de ventas",
      ventas,
    });

  } catch (error) {
    console.error("Error al obtener el histórico:", error);
    return res.status(500).send("Error al cargar el histórico de ventas");
  }
});


try {
  await connection.authenticate();
  connection.sync({});
} catch (error) {
  console.error(error);
}

app.listen(envs.port, () => {
  console.log(`El servidor está escuchando en el puerto ${process.env.PORT}`);
});
