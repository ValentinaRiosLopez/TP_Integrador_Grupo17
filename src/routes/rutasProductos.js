import { Router } from "express";
import {
    requerirClienteApi, 
    requerirSinCompraApi,
} from "../middlewares.js";
import ControladorProductos from "../controllers/controladorProductos.js"

const router = Router();

router.get("/api/productos", 
  requerirClienteApi, 
  requerirSinCompraApi, 
  ControladorProductos.getProductos
);

router.get("/api/productos/juegos", 
  requerirClienteApi, 
  requerirSinCompraApi, 
  ControladorProductos.getJuegos
);

router.get("/api/productos/dados", 
  requerirClienteApi, 
  requerirSinCompraApi, 
  ControladorProductos.getDados
);

export default router;