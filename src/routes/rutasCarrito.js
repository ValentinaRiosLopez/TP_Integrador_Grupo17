import { Router } from "express";
import {
    requerirCliente,
    requerirSinCompra,
    requerirClienteApi,
    requerirSinCompraApi,
} from "../middlewares.js";
import ControladorCarrito from "../controllers/controladorCarrito.js"

const router = Router();


router.post("/carrito", 
  requerirCliente, 
  requerirSinCompra,
  ControladorCarrito.guardarProductoEnCarrito
);


router.get("/api/carrito", 
  requerirClienteApi, 
  ControladorCarrito.getCarrito,
);

//actualiza la cantidad
router.patch("/api/carrito/:id", 
  requerirClienteApi, 
  requerirSinCompraApi,
  ControladorCarrito.actualizarCantidad,
);

//elimina un producto del carrito
router.delete("/api/carrito/:id", 
  requerirClienteApi, 
  requerirSinCompraApi,
  ControladorCarrito.eliminarProducto,
);

//vacia el carrito
router.delete("/carrito/vaciar", 
  requerirClienteApi, 
  requerirSinCompraApi,
  ControladorCarrito.vaciarCarrito,
);

//sube la compra a la base de datos
router.post("/api/carrito/comprar", 
  requerirClienteApi, 
  requerirSinCompraApi,
  ControladorCarrito.subirVenta,
);

export default router;