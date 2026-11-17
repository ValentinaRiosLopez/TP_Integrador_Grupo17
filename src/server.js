import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { envs } from "./config/env.js";
import { connection } from "./config/db_config.js";
import Productos from "./modelos/productos.js";
import Usuarios from "./modelos/usuarios.js";
import Ventas from "./modelos/ventas.js";
import DetalleVenta from "./modelos/detalleVenta.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import multer from "multer";
import {
  setearCookieCliente,
  setearCookieDeAutorizacion,
  leerCookieCliente,
  requerirCliente,
  requerirAutorizacion,
  verificarCamposRequeridos,
  validarSesionActiva, 
  leerCarrito, 
  guardarCarrito,
  requerirClienteApi,
  emitirCookieCliente,
  requerirCompra,
  requerirCompraApi
} from "./middlewares.js";
import puppeteer from "puppeteer";
import ejs from "ejs";
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
// RUTAS

app.get("/", (req, res) => {
  res.sendFile(path.join(carpetaRaiz, "public/static/", "index.html"));
});

app.get("/productos", requerirCliente, async (req, res) => {
  res.sendFile(path.join(carpetaRaiz, "public/static/", "productos.html"));
});

app.get("/productos/juegos", requerirCliente, async (req, res) => {
  res.sendFile(path.join(carpetaRaiz, "public/static/", "productos.html"));
});

app.get("/productos/dados", requerirCliente, async (req, res) => {
  res.sendFile(path.join(carpetaRaiz, "public/static/", "productos.html"));
});

app.get("/carrito", requerirCliente, (req, res) => {
  res.sendFile(path.join(carpetaRaiz, "public/static/", "carrito.html"));
});

app.get("/ticket", requerirCliente, requerirCompra, (req, res) => {
  const compra = res.locals.cliente.compra;
  if (Number(req.query.venta) !== compra) {
    return res.redirect(`/ticket?venta=${compra}`);
  }
  res.sendFile(path.join(carpetaRaiz, "public/static/", "ticket.html"));
});

app.get("/ticket/detalle", requerirCliente, requerirCompra, (req, res) => {
  res.redirect(`/ticket/detalle/${res.locals.cliente.compra}`);
});

app.get("/admin/dashboard", requerirAutorizacion, async (req, res) => {
  try {
    const productos = await Productos.findAll({
      order: [["id", "ASC"]],
    });

    return res.render("admin/dashboard", {
      titulo: "Dashboard | Administración",
      productos,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error al cargar el dashboard");
  }
});

app.get("/admin/productos/nuevo", requerirAutorizacion, async (req, res) => {
  res.render("admin/newProduct", {
    titulo: "Productos | Alta",
    modo: "nuevo",
    productoID: null,
  });
});

app.get("/admin/productos/:id/editar", requerirAutorizacion, (req, res) => {
  const id = Number(req.params.id);

  if (id == null || id <= 0) {
    return res.status(400).send("ID de producto inválido");
  }

  res.render("admin/newProduct", {
    titulo: "Productos | Modificar",
    modo: "editar",
    productoId: id,
  });
});

// ENDPOINTS PRODUCTOS

app.get("/api/productos", requerirClienteApi, async (req, res) => {
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

app.get("/api/productos/juegos", requerirClienteApi, async (req, res) => {
  try {
    const productos = await Productos.findAll({
      where: {
        activo: true,
        tipo: "juego",
      },
    });

    res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al obtener juegos de mesa",
    });
  }
});

app.get("/api/productos/dados", requerirClienteApi, async (req, res) => {
  try {
    const productos = await Productos.findAll({
      where: {
        activo: true,
        tipo: "dado",
      },
    });

    res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al obtener dados",
    });
  }
});

//=======ENDPOINTS CLIENTE========
//Alta cliente
//le setea la cookie y reenderiza la pagina sin el login
app.post("/", setearCookieCliente, (req, res) => {
  res.redirect("/");
});

//Baja cliente
//borra la cookie y vuelve a mostrar el login
app.post("/salir", (req, res) => {
  res.clearCookie("carrito");
  res.clearCookie("cliente", { path: "/" });
  res.redirect("/");
});

app.get("/api/cliente", (req, res) => {
  const cliente = res.locals.cliente;
  res.status(200).json({
    name: cliente?.name ?? null,
    compra: cliente?.compra ?? null,
  });
});

//==== ENDPOINS IMAGENES ====

//guarda imagen en la base de datos
app.post("/subirImagen", upload.single("imagen"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se subio ninguna imagen" });
  }

  //aca armo el string del url de la imagen
  const nombreFile = req.file.filename;
  const rutaImg = `/public/static/imagenes/${nombreFile}`;

  //aca añadimos el url al producto

  res.status(201).json({ imagen: rutaImg });
});

//funcion leer carrito

async function detalleCarrito(req) {
  const carrito = leerCarrito(req);
  if (carrito.length === 0) return { items: [], total: 0 };

    const productos = await Productos.findAll({
    where: { id: carrito.map((i) => i.id), activo: true },
  });

  const items = carrito.flatMap(({ id, cantidad }) => {
    const producto = productos.find((p) => p.id === id);
    if (!producto) return []; // dado de baja: se ignora
    return [
      {
        producto: producto.toJSON(),
        cantidad,
        subtotal: Number(producto.precio) * cantidad,
      },
    ];
  });

  const total = items.reduce((acc, i) => acc + i.subtotal, 0);
  return { items, total };
}

//=======ENDPOINTS CARRITO==========

app.post("/carrito", requerirCliente, async (req, res) => {
  const id = Number(req.body.productoId);
  const cantidad = parseInt(req.body.cantidad) || 1; //si la cantidad es invalida defaultea a 1

  //si el id es invalido
  if (!Number.isInteger(id)) return res.status(400).send("Producto inválido");

  //busca si el producto existe y esta activo
  const producto = await Productos.findOne({ where: { id, activo: true } });
  if (!producto) return res.status(404).send("Producto no encontrado");

  //busca si hay productos en el carrito sino devuelve un array vacio
  const carrito = leerCarrito(req);
  const item = carrito.find((i) => i.id === id); //busca si ya se agrego el producto al carrito

  //si ya existe en el carrito suma las cantidades con tope de 10 (si se pasa devuelve 10)
  if (item) item.cantidad = Math.min(10, item.cantidad + cantidad);
  else carrito.push({ id, cantidad });

  guardarCarrito(res, carrito); //guarda el carrito

  //si el mismo cliente quiere hacer otra compra
  if (res.locals.cliente.compra) {
    await emitirCookieCliente(res, { name: res.locals.cliente.name });
  }

  res.redirect(req.get("referer") || "/productos"); // vuelve a donde estaba
});

app.get("/api/carrito", requerirClienteApi, async (req, res) => {
  try {
    const { items, total } = await detalleCarrito(req);
    res.status(200).json({ items, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

//actualiza la cantidad
app.patch("/api/carrito/:id", requerirClienteApi, (req, res) => {
  const id = Number(req.params.id);
  const cantidad = Number(req.body?.cantidad);

  if (!Number.isInteger(id) || !Number.isInteger(cantidad)) {
    return res.status(400).json({ error: "Datos inválidos" });
  }
  if (cantidad < 1 || cantidad > 10) {
    return res
      .status(400)
      .json({ error: "La cantidad debe estar entre 1 y 10" });
  }

  const carrito = leerCarrito(req);
  const item = carrito.find((i) => i.id === id);
  if (!item)
    return res.status(404).json({ error: "El producto no está en el carrito" });

  item.cantidad = cantidad;
  guardarCarrito(res, carrito);
  res.status(200).json({ id, cantidad });
});

//elimina un producto del carrito
app.delete("/api/carrito/:id", requerirClienteApi, (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Producto inválido" });
  }

  const carrito = leerCarrito(req).filter((i) => i.id !== id);
  guardarCarrito(res, carrito);
  res.status(200).json({ id });
});

//vacia el carrito
app.delete("/carrito/vaciar", requerirClienteApi, (req, res) => {
  res.clearCookie("carrito", { path: "/" });
  res.status(200).json({ ok: true });
});

app.post("/api/carrito/comprar", requerirClienteApi, async (req, res) => {
  try {
    const { items, total } = await detalleCarrito(req);

    if (items.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío." });
    }

    const venta = await connection.transaction(async (t) => {
      const ventaNueva = await Ventas.create(
        {
          nombre_cliente: res.locals.cliente.name.slice(0, 100),
          total,
        },
        { transaction: t },
      );

      await DetalleVenta.bulkCreate(
        items.map(({ producto, cantidad, subtotal }) => ({
          id_venta: ventaNueva.id,
          id_producto: producto.id,
          cantidad,
          subtotal,
        })),
        { transaction: t },
      );

      return ventaNueva;
    });

    res.clearCookie("carrito", { path: "/" });

    await emitirCookieCliente(res, {
      name: res.locals.cliente.name,
      compra: venta.id,
    });

    res.status(201).json({ id: venta.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar la compra" });
  }
});

//RELACIONES VENTAS
Ventas.hasMany(DetalleVenta, { foreignKey: "id_venta", as: "detalles" });
DetalleVenta.belongsTo(Ventas, { foreignKey: "id_venta" });

DetalleVenta.belongsTo(Productos, {
  foreignKey: "id_producto",
  as: "producto",
});
Productos.hasMany(DetalleVenta, { foreignKey: "id_producto" });

//====ENDPOINTS TICKET=====

app.get("/api/venta/:id", requerirClienteApi, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "ERROR ID Invalido." });
  }

  try {
    // 404 si no existe o si es de otro cliente (no revela que existe)
    if (res.locals.cliente.compra !== id) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    const venta = await Ventas.findByPk(id, {
      include: {
        model: DetalleVenta,
        as: "detalles",
        include: { model: Productos, as: "producto" },
      },
    });

    if (!venta) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    res.status(200).json({
      id: venta.id,
      nombre_cliente: venta.nombre_cliente,
      fecha: venta.fecha,
      total: Number(venta.total),
      items: venta.detalles.map((d) => ({
        producto: {
          id: d.id_producto,
          nombre: d.producto?.nombre ?? "Producto eliminado",
        },
        cantidad: d.cantidad,
        subtotal: Number(d.subtotal),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la venta" });
  }
});

async function crearPDF(ticket) {
  const baseUrl = `http://localhost:${envs.port}`;

  const html = await ejs.renderFile(
      path.join(carpetaRaiz, "views", "ticketDetalle.ejs"),
      { ticket }
    );

  const htmlConBase = html.replace("<head>", `<head><base href="${baseUrl}/">`);
  
  const navegador = await puppeteer.launch({ headless: true });

  try {
    const pagina = await navegador.newPage();

    await pagina.setContent(htmlConBase);

    const pdfBuffer = await pagina.pdf({
      format: "A4",
      printBackground: false,
    });

    return pdfBuffer;
  } finally {
    await navegador.close(); // siempre, aunque falle algo arriba
  }
}

function formatearFecha(iso) {
  const fecha = new Date(iso);

  const dia = fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Argentina/Buenos_Aires",
  });

  const hora = fecha.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  });

  return `${dia} - ${hora} hs`;
}

async function obtenerVenta(id) {
  const venta = await Ventas.findByPk(id, {
    include: {
      model: DetalleVenta,
      as: "detalles",
      include: { model: Productos, as: "producto" },
    },
  });

  if (!venta) return null;

  return {
    id: venta.id,
    nombre_cliente: venta.nombre_cliente,
    fecha: formatearFecha(venta.fecha),
    total: Number(venta.total),
    items: venta.detalles.map((d) => ({
      producto: {
        id: d.id_producto,
        nombre: d.producto?.nombre ?? "Producto eliminado",
      },
      cantidad: d.cantidad,
      subtotal: Number(d.subtotal),
    })),
  };
}

app.get("/ticket/detalle/:id", requerirCliente, requerirCompra, async (req, res) => {
const id = Number(req.params.id);

  // solo la compra de esta sesión
  if (!Number.isInteger(id) || res.locals.cliente.compra !== id) {
    return res.status(404).send("Compra no encontrada");
  }

  try {

  const ticket = await obtenerVenta(id);
  if (!ticket) {
    return res.status(404).json({ error: "Venta no encontrada" });
  }

  res.render("ticketDetalle", {ticket });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener la compra");
  }
});


app.get("/api/ticket/descargar/:id",  requerirClienteApi, requerirCompraApi, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {

    const ticket = await obtenerVenta(id);

    if (!ticket){
      return res.status(404).json({ error: "Venta no encontrada" }); 
    } 

    const pdf = await crearPDF(ticket);
    

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="factura-${id}.pdf"`,
    });
    res.status(200).send(Buffer.from(pdf)); // Puppeteer devuelve Uint8Array
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo generar el PDF" });
  }  
});
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

app.post("/api/admin/productos", requerirAutorizacion, async (req, res) => {
  try {
    const { nombre, descripcion, precio, tipo, imagen } = req.body;

    if (
      !nombre ||
      !String(nombre).trim() ||
      precio === undefined ||
      precio === null ||
      precio === ""
    ) {
      return res.status(400).json({
        error: "El nombre y el precio son obligatorios",
      });
    }

    if (
      typeof nombre !== "string" ||
      !nombre.trim() ||
      nombre.trim().length > 100 ||
      (descripcion != null &&
        (typeof descripcion !== "string" || descripcion.length > 500))
    ) {
      return res.status(400).json({
        error: "Nombre o descripción inválidos",
      });
    }

    const precioNumero = Number(precio);

    if (
      precio === "" ||
      precio == null ||
      !Number.isFinite(precioNumero) ||
      precioNumero < 0
    ) {
      return res.status(400).json({
        error: "El precio debe ser un número válido mayor o igual a cero",
      });
    }

    if (!["juego", "dado"].includes(tipo)) {
      return res.status(400).json({
        error: "Tipo de producto inválido",
      });
    }

    const categoria = tipo === "juego" ? "Juegos de mesa" : "Dados";

    const productoNuevo = await Productos.create({
      nombre: String(nombre).trim(),
      descripcion: descripcion || null,
      precio: precioNumero,
      imagen: imagen || null,
      categoria,
      tipo,
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
});

app.get("/api/admin/productos/:id", requerirAutorizacion, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (id == null || id <= 0) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const producto = await Productos.findByPk(id);

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
});

app.put("/api/admin/productos/:id", requerirAutorizacion, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, descripcion, precio, tipo, imagen } = req.body;

    if (id == null || id <= 0) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const producto = await Productos.findByPk(id);

    if (!producto) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    if (
      typeof nombre !== "string" ||
      !nombre.trim() ||
      nombre.trim().length > 100 ||
      (descripcion != null &&
        (typeof descripcion !== "string" || descripcion.length > 500))
    ) {
      return res.status(400).json({
        error: "Nombre o descripción inválidos",
      });
    }

    const precioNumero = Number(precio);

    if (
      precio === "" ||
      precio == null ||
      !Number.isFinite(precioNumero) ||
      precioNumero < 0
    ) {
      return res.status(400).json({
        error: "Precio inválido",
      });
    }

    if (!["juego", "dado"].includes(tipo)) {
      return res.status(400).json({
        error: "Tipo de producto inválido",
      });
    }

    const categoria = tipo === "juego" ? "Juegos de mesa" : "Dados";

    await producto.update({
      nombre: nombre.trim(),
      descripcion: descripcion || null,
      precio: precioNumero,
      tipo,
      categoria,
      imagen: imagen ?? producto.imagen,
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
});

app.delete(
  "/api/admin/productos/:id",
  requerirAutorizacion,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          error: "ID de producto inválido",
        });
      }

      const producto = await Productos.findByPk(id);

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

try {
  await connection.authenticate();
  connection.sync({});
} catch (error) {
  console.error(error);
}

app.listen(envs.port, () => {
  console.log(`El servidor está escuchando en el puerto ${process.env.PORT}`);
});
