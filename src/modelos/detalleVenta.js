import { DataTypes, Model } from "sequelize";
import { connection } from "../config/db_config.js";

const DetalleVenta = connection.define(
  "DetalleVenta",
    {
      id_venta: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
      },
      id_producto: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
      },
      cantidad: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
  },
  {
    sequelize: connection,
    modelName: "DetalleVenta",
    tableName: "detalle_venta", // cambialo por el nombre real de tu tabla
    timestamps: false,
  },
);


export default DetalleVenta;