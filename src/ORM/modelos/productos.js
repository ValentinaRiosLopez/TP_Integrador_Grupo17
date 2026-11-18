import { DataTypes } from "sequelize";
import { connection } from "../database/db_config.js";
import DetalleVenta from "./detalleVenta.js";

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

DetalleVenta.belongsTo(Productos, {
  foreignKey: "id_producto",
  as: "producto",
});
Productos.hasMany(DetalleVenta, { foreignKey: "id_producto" });

export default Productos;
