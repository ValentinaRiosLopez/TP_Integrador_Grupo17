import path from "node:path";
import { 
    requerirCliente,
    requerirSinCompra, 
    requerirCompra, 
    requerirAutorizacion,
    leerModo,
    guardarModo,
    validarIdProducto,
} from "../middlewares.js";
import Productos from "../ORM/modelos/productos.js";


const __dirname = import.meta.dirname;
const carpetaRaiz = path.join(__dirname, "..", "..");

export const renderIndex = (req, res) => {
  const modo = leerModo(req);
  guardarModo(res, modo);
  res.sendFile(path.join(carpetaRaiz, "public/static/", "index.html"));
};

export const renderProductos = async (req, res) => {
  res.sendFile(path.join(carpetaRaiz, "public/static/", "productos.html"));
};

export const renderCarrito = (req, res) => {
  res.sendFile(path.join(carpetaRaiz, "public/static/", "carrito.html"));
};

export const renderTicket = (req, res) => {
  const compra = res.locals.cliente.compra;
  if (Number(req.query.venta) !== compra) {
    return res.redirect(`/ticket?venta=${compra}`);
  }
  res.sendFile(path.join(carpetaRaiz, "public/static/", "ticket.html"));
}

export const renderDetalleTicket =  (req, res) => {
  res.redirect(`/ticket/detalle/${res.locals.cliente.compra}`);
}

export const renderAdminLogin = (req, res) => {
  res.render("admin/login", {
    titulo: "Login | Administración",
  });
};

export const renderAdminDashboard = async (req, res) => {
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
};

export const renderAdminNewProducto = async (req, res) => {
    res.render("admin/newProduct", {
        titulo: "Productos | Alta",
        modo: "nuevo",
        productoId: null,
    });
} 

export const renderAdminEditProducto = (req, res) => {
    res.render("admin/newProduct", {
        titulo: "Productos | Modificar",
        modo: "editar",
        productoId: req.productoId,
    });
}

export default {
    renderIndex,
    renderProductos,
    renderCarrito,
    renderTicket,
    renderDetalleTicket,
    renderAdminLogin,
    renderAdminDashboard,
    renderAdminNewProducto,
    renderAdminEditProducto
};