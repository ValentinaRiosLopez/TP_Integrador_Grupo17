import { Router } from "express";
import {
    setearCookieCliente,
} from "../middlewares.js";
import ControladorCliente from "../controllers/controladorCliente.js";

const router = Router();

//====ALTA COOKIE CLIENTE=====
//le setea la cookie y reenderiza la pagina sin el login
router.post("/", setearCookieCliente, ControladorCliente.recargarPagina);

//====BAJA COOKIE CLIENTE====
//borra la cookie y vuelve a mostrar el login
router.post("/salir", ControladorCliente.borrarCookies);

//====CONSULTA CLIENTE====
//devuelve el contenido de la cookie de cliente
router.get("/api/cliente", ControladorCliente.getCookieCliente);

export default router;
