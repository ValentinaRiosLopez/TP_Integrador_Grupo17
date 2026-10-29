import { DataTypes } from "sequelize";
import { connection } from "../config/db_config.js";

const Productos = connection.define(
  "Productos",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    descripcion: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    imagen: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    categoria: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    tipo: {
      type: DataTypes.ENUM("juego", "dado", "accesorio"),
      allowNull: false,
    },

    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "productos",
    timestamps: true,
  },
);

export default Productos;
