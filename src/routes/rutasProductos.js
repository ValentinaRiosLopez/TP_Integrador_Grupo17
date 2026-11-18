import { Router } from "express";
import Productos from "../ORM/modelos/productos.js";
import {
    requerirClienteApi, 
    requerirSinCompraApi,
} from "../middlewares.js";

const router = Router();

router.get("/api/productos", requerirClienteApi, requerirSinCompraApi,async (req, res) => {
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

router.get("/api/productos/juegos", requerirClienteApi, requerirSinCompraApi, async (req, res) => {
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

router.get("/api/productos/dados", requerirClienteApi, requerirSinCompraApi, async (req, res) => {
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

export default router;