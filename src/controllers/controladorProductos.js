import Productos from "../ORM/modelos/productos.js";

export const getProductos = async (req, res) => {
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
};

export const getJuegos = async (req, res) => {
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
      error: "Error al obtener juego",
    });
  }
};

export const getDados =  async (req, res) => {
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
};

export default {
    getProductos,
    getJuegos,
    getDados,
};