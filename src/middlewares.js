import jwt from "jsonwebtoken";
import { envs } from "./config/env.js";

const secret = envs.apiSecret;

/*
export async function leerCookie(req, res, next) {
  const cookie = req.cookies.autorizacion;

  console.log(cookie);

  if (!cookie) {
    return res.status(403).send("No tenés cookies");
  }

  try {
    const payload = jwt.verify(cookie, secret);

    console.log("Payload:", payload);

    return res.status(200).send(payload);
  } catch (e) {
    console.log("Firma inválida o token expirado:", e.message);
    return res.status(401).send("Token inválido o expirado");
  }
}
*/

// Función para generar el token
async function generarJWT(payload) {
  const token = jwt.sign(payload, secret, {
    expiresIn: "30m",
  });

  return token;
}

export async function setearCookieDeAutorizacion(req, res, next) {
  const { name, email, id } = req.body;
  const token = await generarJWT({
    name,
    email,
    id,
  });

  res.cookie("autorizacion", token, {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 300000,
  });

  res.status(200).send("Cookie seteada");
}


//seteo la cookie de cliente
export async function setearCookieCliente(req, res, next) {
  const name = req.body?.name?.trim();
  const token = await generarJWT({
    name
  });

  if (!name) return res.redirect("/");

  res.cookie("cliente", token, {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 1000 * 60 * 10,
  });


  next();
}



export function leerCookieCliente(req, res, next) {

  res.locals.cliente = null; //aca inicializo la variable de cliente para que siempre exista

  const token = req.cookies?.cliente; //leo la cookie 
   
  if (token) {
    try {
      res.locals.cliente = jwt.verify(token, secret);//verifico el token y lo guardo en locals para poder usar el nombre despues
    } catch {
      res.clearCookie("cliente", { path: "/" }); //sino borra la cookie invalida
    }
  }
  next();
}

//si pasa el tiempo de expiracion devuelve al cliente al login
export function requerirCliente(req, res, next) {
  if (!res.locals.cliente) return res.redirect("/");
  next();
}