import Usuarios from "../ORM/modelos/usuarios.js";
import Productos from "../ORM/modelos/productos.js";
import Ventas from "../ORM/modelos/ventas.js";
import bcrypt from "bcrypt";
import DetalleVenta from "../ORM/modelos/detalleVenta.js";
import {
    setearCookieDeAutorizacion,
} from "../middlewares.js";



export const altaUsuario = async (req, res) => {
    try {
      const { nombre = "", email = "", password = "" } = req.body;

      const usuarioExistente = await Usuarios.findOne({
        where: {
          email: email,
        },
      });

      if (usuarioExistente) {
        res.status(409).json({
          // 409 Conflict HTTP status code.
          error: "El usuario ya existe",
        });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const crearUsuario = await Usuarios.create({
        nombre: nombre,
        email: email,
        password_hash: passwordHash,
      });

      return res.status(201).json({
        mensaje: "Usuario creado correctamente",
        usuario: {
          id: crearUsuario.id,
          nombre: crearUsuario.nombre,
          email: crearUsuario.email,
        },
      }); // 201 Created HTTP status code.
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Error al intentar crear usuario",
      });
    }
}


export const loginUsuarios =   async (req, res) => {
    try {
      const { email = "", password = "" } = req.body;

      const noAutorizado = () => {
        return res.status(401).json({
          // 401 Unauthorized HTTP status code.
          error: "Credenciales inválidas",
        });
      };

      const usuarioExistente = await Usuarios.findOne({
        where: {
          email: email,
        },
      });

      if (!usuarioExistente) {
        return noAutorizado();
      }

      const validacionDeContrasena = await bcrypt.compare(
        password,
        usuarioExistente.password_hash,
      );

      if (!validacionDeContrasena) {
        return noAutorizado();
      }

      req.usuarioAutenticado = usuarioExistente;

      await setearCookieDeAutorizacion(req, res);

      return res.status(200).json({
        mensaje: "Usuario logueado correctamente",
        usuario: {
          nombre: usuarioExistente.nombre,
          email: usuarioExistente.email,
        },
      }); // 200 OK HTTP status code.
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Error al intentar loguear usuario",
      });
    }
}

export const crearNuevoProducto =   async (req, res) => {
    try {
        const productoNuevo = await Productos.create({
        ...req.productoValidado,
        activo: true,
        });

        return res.status(201).json({
        mensaje: "Producto creado correctamente",
        producto: productoNuevo,
        });
    } catch (error) {
        console.error("Error al crear producto:", error);

        return res.status(500).json({
        error: "Error al crear el producto",
        });
    }
};

export const getProducto = async (req, res) => {
    try {
        const producto = await Productos.findByPk(req.productoId);

        if (!producto) {
        return res.status(404).json({
            error: "Producto no encontrado",
        });
        }

        return res.status(200).json(producto);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
        error: "Error al obtener el producto",
        });
    }
}

export const modificarProducto = async (req, res) => {
    try {
        const producto = await Productos.findByPk(req.productoId);

        if (!producto) {
        return res.status(404).json({
            error: "Producto no encontrado",
        });
        }

        await producto.update({
        ...req.productoValidado,
        });

        return res.status(200).json({
        mensaje: "Producto modificado correctamente",
        producto,
        });
    } catch (error) {
        console.error("Error al modificar producto:", error);

        return res.status(500).json({
        error: "Error al modificar producto",
        });
    }
}

export const borrarProducto = async (req, res) => {
    try {
        const producto = await Productos.findByPk(req.productoId);

        if (!producto) {
        return res.status(404).json({
            error: "Producto no encontrado",
        });
        }

        if (!producto.activo) {
        return res.status(409).json({
            error: "El producto ya está desactivado",
        });
        }

        await producto.update({
        activo: false,
        });

        return res.status(200).json({
        mensaje: "Producto desactivado correctamente",
        });
    } catch (error) {
        console.error("Error al eliminar producto:", error);

        return res.status(500).json({
        error: "Error al eliminar el producto",
        });
    }
}

export const activarProducto =   async (req, res) => {
    try {
        const producto = await Productos.findByPk(req.productoId);

        if (!producto) {
        return res.status(404).json({
            error: "Producto no encontrado",
        });
        }

        if (producto.activo) {
        return res.status(409).json({
            error: "El producto ya está activo",
        });
        }

        await producto.update({
        activo: true,
        });

        return res.status(200).json({
        mensaje: "Producto disponibilizado correctamente",
        });
    } catch (error) {
        console.error("Error al activar producto:", error);

        return res.status(500).json({
        error: "Error al activar el producto",
        });
    }
}

export const getVentas = async (req, res) => {
  try {
    const ventas = await Ventas.findAll({
      include: [
        {
          model: DetalleVenta,
          as: "detalles",
          include: [
            {
              model: Productos,
              as: "producto",
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    return res.render("admin/historicoVentas", {
      titulo: "Histórico de ventas",
      ventas,
    });

  } catch (error) {
    console.error("Error al obtener el histórico:", error);
    return res.status(500).send("Error al cargar el histórico de ventas");
  }
}

export const borrarAutorizacion = (req, res) => {
  res.clearCookie("autorizacion");
  res.redirect("/");
};

export default {
    altaUsuario,
    loginUsuarios,
    crearNuevoProducto,
    getProducto,
    modificarProducto,
    borrarProducto,
    activarProducto,
    getVentas,
    borrarAutorizacion,
};