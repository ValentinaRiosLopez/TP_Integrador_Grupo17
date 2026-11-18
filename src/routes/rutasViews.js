import { Router } from "express";
import path from "node:path";
//import { fileURLToPath } from "node:url";
import { 
    requerirCliente,
    requerirSinCompra, 
    requerirCompra, 
    requerirAutorizacion,
    leerModo,
    guardarModo
} from "../middlewares.js";
import Productos from "../ORM/modelos/productos.js";

const router = Router();
const __dirname = import.meta.dirname;
const carpetaRaiz = path.join(__dirname, "..", "..");


router.get("/", (req, res) => {
  const modo = leerModo(req);
  guardarModo(res, modo);
  res.sendFile(path.join(carpetaRaiz, "public/static/", "index.html"));
});

router.get("/productos", requerirCliente, requerirSinCompra ,async (req, res) => {
  res.sendFile(path.join(carpetaRaiz, "public/static/", "productos.html"));
});

router.get("/productos/juegos", requerirCliente, requerirSinCompra, async (req, res) => {
  res.sendFile(path.join(carpetaRaiz, "public/static/", "productos.html"));
});

router.get("/productos/dados", requerirCliente, requerirSinCompra,async (req, res) => {
  res.sendFile(path.join(carpetaRaiz, "public/static/", "productos.html"));
});

router.get("/carrito", requerirCliente, requerirSinCompra,(req, res) => {
  res.sendFile(path.join(carpetaRaiz, "public/static/", "carrito.html"));
});

router.get("/ticket", requerirCliente, requerirCompra, (req, res) => {
  const compra = res.locals.cliente.compra;
  if (Number(req.query.venta) !== compra) {
    return res.redirect(`/ticket?venta=${compra}`);
  }
  res.sendFile(path.join(carpetaRaiz, "public/static/", "ticket.html"));
});

router.get("/ticket/detalle", requerirCliente, requerirCompra, (req, res) => {
  res.redirect(`/ticket/detalle/${res.locals.cliente.compra}`);
});

router.get("/admin/login", (req, res) => {
  res.render("admin/login", {
    titulo: "Login | Administración",
  });
});

router.get("/admin/dashboard", requerirAutorizacion, async (req, res) => {
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

router.get("/admin/productos/nuevo", requerirAutorizacion, async (req, res) => {
  res.render("admin/newProduct", {
    titulo: "Productos | Alta",
    modo: "nuevo",
    productoId: null,
  });
});

router.get("/admin/productos/:id/editar", requerirAutorizacion, (req, res) => {
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

export default router;