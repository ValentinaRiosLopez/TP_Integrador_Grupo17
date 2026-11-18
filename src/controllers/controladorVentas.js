import Ventas from "../ORM/modelos/ventas.js";
import DetalleVenta from "../ORM/modelos/detalleVenta.js";
import Productos from "../ORM/modelos/productos.js";
import path from "node:path";
import puppeteer from "puppeteer";
import ejs from "ejs";
import { envs } from "../config/env.js";

const __dirname = import.meta.dirname;
const carpetaRaiz = path.join(__dirname, "..", "..");

async function getHTML(ticket){
  const baseUrl = `http://localhost:${envs.port}`;

  const html = await ejs.renderFile(
    path.join(carpetaRaiz, "views", "ticketDetalle.ejs"),
    { ticket },
  );

  const htmlConBase = html.replace("<head>", `<head><base href="${baseUrl}/">`);

  return htmlConBase;
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
};

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
};

export const getVentaPorId = async (req, res) => {

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
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la venta" });
  }
};


export const getDescargaPDF = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "ID inválido" });
  }

  if (res.locals.cliente.compra !== id) {
      return res.status(404).json({ error: "Venta no encontrada" });
  }

  let browser;

  try {
    const ticket = await obtenerVenta(id);

    if (!ticket) {
        return res.status(404).json({ error: "Venta no encontrada" });
    }

    const html = await getHTML(ticket);

    browser = await puppeteer.launch({
        headless: true
    });

    const pagina = await browser.newPage();

    await pagina.setContent(html, {
        waitUntil: "networkidle0"
    });

    const pdfBuffer = await pagina.pdf({
        format: "A4",
        printBackground: true
    });

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="factura-${id}.pdf"`
    });

    return res.status(200).send(pdfBuffer);

  } catch (error) {

    return res.status(500).json({
        error: "No se pudo generar el PDF"
    });
    
  } finally {
    if (browser) {
        await browser.close();
    }
  }

}


export default {
    getVentaPorId,
    getDescargaPDF
};