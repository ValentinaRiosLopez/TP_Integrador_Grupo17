import { Router } from "express";
import {
    setearCookieCliente,
} from "../middlewares.js";

const router = Router();

//====ALTA COOKIE CLIENTE=====
//le setea la cookie y reenderiza la pagina sin el login
router.post("/", setearCookieCliente, (req, res) => {
  res.redirect("/");
});

//====BAJA COOKIE CLIENTE====
//borra la cookie y vuelve a mostrar el login
router.post("/salir", (req, res) => {
  res.clearCookie("carrito");
  res.clearCookie("cliente", { path: "/" });
  res.redirect("/");
});

//====CONSULTA CLIENTE====
//devuelve el contenido de la cookie de cliente
router.get("/api/cliente", (req, res) => {
  const cliente = res.locals.cliente;
  res.status(200).json({
    name: cliente?.name ?? null,
    compra: cliente?.compra ?? null,
  });
});

export default router;
