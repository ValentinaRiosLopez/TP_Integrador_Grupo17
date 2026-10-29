import { Sequelize } from "sequelize";
import { envs } from "./env.js";

export const connection = new Sequelize(
  envs.db.name,
  envs.db.user,
  envs.db.pass,
  {
    host: envs.db.host,
    dialect: "mysql",
  },
);
