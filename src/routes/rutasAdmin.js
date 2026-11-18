import { Router } from "express";
import {
    verificarCamposRequeridos,
    validarSesionActiva,
    requerirAutorizacion,
    validarDatosProducto,
    validarIdProducto,
} from "../middlewares.js";
import ControladorAdmin, { getProducto } from "../controllers/controladorAdmin.js"

const router = Router();

// Alta de usuarios
router.post(
  "/api/admin/altaUsuario",
  verificarCamposRequeridos("nombre", "email", "password"),
  ControladorAdmin.altaUsuario,
);


// Login de usuarios
router.post(
  "/api/admin/login",
  validarSesionActiva,
  verificarCamposRequeridos("email", "password"),
  ControladorAdmin.loginUsuarios,
);

//Alta producto
router.post(
  "/api/admin/productos",
  requerirAutorizacion,
  validarDatosProducto,
  ControladorAdmin.crearNuevoProducto,
);

router.get(
  "/api/admin/productos/:id",
  requerirAutorizacion,
  validarIdProducto,
  getProducto,
);

router.put(
  "/api/admin/productos/:id",
  requerirAutorizacion,
  validarIdProducto,
  validarDatosProducto,
  ControladorAdmin.modificarProducto,
);

router.delete(
  "/api/admin/productos/:id",
  requerirAutorizacion,
  validarIdProducto,
  ControladorAdmin.borrarProducto,
);

router.put(
  "/api/admin/productos/:id/activar",
  requerirAutorizacion,
  validarIdProducto,
  ControladorAdmin.activarProducto,
);


router.get("/admin/historico-ventas", 
  requerirAutorizacion,
  ControladorAdmin.getVentas,
);

router.get("/salir/admin",
  ControladorAdmin.borrarAutorizacion,
);


export default router;