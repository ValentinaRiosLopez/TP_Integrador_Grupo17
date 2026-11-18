import { Router } from "express";
import ControladorViews from "../controllers/controladorViews.js";
import { 
    requerirCliente,
    requerirSinCompra, 
    requerirCompra, 
    requerirAutorizacion,
    validarIdProducto,
} from "../middlewares.js";



const router = Router();



router.get("/", ControladorViews.renderIndex);

router.get("/productos", 
  requerirCliente, 
  requerirSinCompra, 
  ControladorViews.renderProductos
);

router.get("/productos/juegos", 
  requerirCliente, 
  requerirSinCompra, 
  ControladorViews.renderProductos
);

router.get("/productos/dados", 
  requerirCliente, 
  requerirSinCompra, 
  ControladorViews.renderProductos
);

router.get("/carrito", 
  requerirCliente, 
  requerirSinCompra, 
  ControladorViews.renderCarrito
);

router.get("/ticket", 
  requerirCliente, 
  requerirCompra, 
  ControladorViews.renderTicket
);

router.get("/ticket/detalle", 
  requerirCliente, 
  requerirCompra, 
  ControladorViews.renderDetalleTicket
);

router.get("/admin/login", 
  ControladorViews.renderAdminLogin
);

router.get("/admin/dashboard", 
  requerirAutorizacion, 
  ControladorViews.renderAdminDashboard
);

router.get("/admin/productos/nuevo", 
  requerirAutorizacion, 
  ControladorViews.renderAdminNewProducto
);

router.get( "/admin/productos/:id/editar", 
  requerirAutorizacion, 
  validarIdProducto, 
  ControladorViews.renderAdminEditProducto
);

export default router;