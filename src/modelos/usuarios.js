import { DataTypes } from "sequelize";
import { connection } from "../config/db_config.js";

const Usuarios = connection.define(
  "Usuarios",
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

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },

    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "usuarios",
    timestamps: true,
  },
);

export default Usuarios;
