import { DataTypes, Model } from "sequelize";
import { connection } from "../database/db_config.js";
import DetalleVenta from "./detalleVenta.js";

const Ventas = connection.define(
    "Ventas",
    {
        id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        },
        nombre_cliente: {
        type: DataTypes.STRING(100),
        allowNull: false,
        },
        fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        },
        total: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        },
    },
    {
        sequelize: connection,
        modelName: "Ventas",
        tableName: "ventas", // cambialo si tu tabla se llama distinto
        timestamps: false,
    },  
    
);

Ventas.hasMany(DetalleVenta, { foreignKey: "id_venta", as: "detalles" });
DetalleVenta.belongsTo(Ventas, { foreignKey: "id_venta" });

export default Ventas;