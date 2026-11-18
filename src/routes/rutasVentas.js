import { Router } from "express";
import Ventas from "../ORM/modelos/ventas.js";
import DetalleVenta from "../ORM/modelos/detalleVenta.js";
import Productos from "../ORM/modelos/productos.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import ejs from "ejs";
import { envs } from "../config/env.js";
import {
    requerirClienteApi,
    requerirCompraApi,
    requerirCliente,
  requerirCompra,
} from "../middlewares.js";

const router = Router();

const __dirname = import.meta.dirname;
const carpetaRaiz = path.join(__dirname, "..", "..");

router.get("/api/venta/:id", requerirClienteApi, requerirCompraApi, async (req, res) => {
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
    { ticket },
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

router.get(
  "/ticket/detalle/:id",
  requerirCliente,
  requerirCompra,
  async (req, res) => {
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

      res.render("ticketDetalle", { ticket });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener la compra");
    }
  },
);

router.get(
  "/api/ticket/descargar/:id",
  requerirClienteApi,
  requerirCompraApi,
  async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    if (res.locals.cliente.compra !== id) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    try {
      const ticket = await obtenerVenta(id);

      if (!ticket) {
        return res.status(404).json({ error: "Venta no encontrada" });
      }

      const pdf = await crearPDF(ticket);

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="factura-${id}.pdf"`,
      });
      res.status(200).send(Buffer.from(pdf));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "No se pudo generar el PDF" });
    }
  },
);

export default router;