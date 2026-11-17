import { DataTypes, Model } from "sequelize";
import { connection } from "../config/db_config.js";

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



export default Ventas;