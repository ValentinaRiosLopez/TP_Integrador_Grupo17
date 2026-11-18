import { Router } from "express";
import Productos from "../ORM/modelos/productos.js";
import Ventas from "../ORM/modelos/ventas.js";
import DetalleVenta from "../ORM/modelos/detalleVenta.js";
import { connection } from "../ORM/database/db_config.js";
import {
    requerirCliente,
    requerirSinCompra,
    leerCarrito,
    guardarCarrito,
    requerirClienteApi,
    requerirSinCompraApi,
    emitirCookieCliente
} from "../middlewares.js";

const router = Router();

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

router.post("/carrito", requerirCliente, requerirSinCompra, async (req, res) => {
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

  res.redirect(req.get("referer") || "/productos"); // vuelve a donde estaba
});

router.get("/api/carrito", requerirClienteApi, async (req, res) => {
  try {
    const { items, total } = await detalleCarrito(req);
    res.status(200).json({ items, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

//actualiza la cantidad
router.patch("/api/carrito/:id", requerirClienteApi, requerirSinCompraApi,(req, res) => {
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
router.delete("/api/carrito/:id", requerirClienteApi, requerirSinCompraApi, (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Producto inválido" });
  }

  const carrito = leerCarrito(req).filter((i) => i.id !== id);
  guardarCarrito(res, carrito);
  res.status(200).json({ id });
});

//vacia el carrito
router.delete("/carrito/vaciar", requerirClienteApi, requerirSinCompraApi, (req, res) => {
  res.clearCookie("carrito", { path: "/" });
  res.status(200).json({ ok: true });
});

router.post("/api/carrito/comprar", requerirClienteApi, requerirSinCompraApi, async (req, res) => {
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

export default router;