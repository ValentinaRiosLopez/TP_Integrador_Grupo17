import { Router } from "express";
import {
    leerModo,
    guardarModo
} from "../middlewares.js";
const router = Router();

router.post("/api/modo", (req, res) => {
  const modos = ["claro", "oscuro"];

  const modo = req.body.modo;

  if (!modos.includes(modo)) return res.status(400).send("Modo invalido");

  const modoGuardado = leerModo(req);

  if (modoGuardado !== modo) {
    guardarModo(res, modo);
  }

  res.status(200).redirect(req.get("referer") || "/"); // vuelve a donde estaba
});

router.get("/api/modo", (req, res) => {
  try {
    const modo = leerModo(req);
    res.status(200).json(modo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el modo" });
  }
});

export default router;