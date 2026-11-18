import { Router } from "express";
import {
    requerirClienteApi,
    requerirCompraApi,
} from "../middlewares.js";
import ControladorVentas from "../controllers/controladorVentas.js"

const router = Router();


router.get("/api/venta/:id", 
  requerirClienteApi, 
  requerirCompraApi, 
  ControladorVentas.getVentaPorId
);

router.get(
  "/api/ticket/descargar/:id",
  requerirClienteApi,
  requerirCompraApi,
  ControladorVentas.getDescargaPDF
);

export default router;