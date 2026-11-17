
import jwt from "jsonwebtoken";
import { envs } from "./config/env.js";

const secret = envs.apiSecret;
const EXP_COOKIE_CLIENTE = 1000 * 60 * 10;

const EXP_COOKIE_AUTORIZACION = 1000 * 60 * 30;

const EXP_COOKIE_CARRITO = 1000 * 60 * 10;
const EXP_COOKIE_MODO = 1000 * 60 * 60;


// Función para generar el token
async function generarJWT(payload,  expiresIn = "10m") {
  const token = jwt.sign(payload, secret, { expiresIn});
  return token;
}

export async function setearCookieDeAutorizacion(req, res, next = () => {}) {
  const usuario = req.usuarioAutenticado;

  if (!usuario) {
    return res.status(401).json({
      error: "Usuario no autenticado",
    });
  }

  const token = await generarJWT({
    id: usuario.id,
  }, EXP_COOKIE_AUTORIZACION/1000);

  res.cookie("autorizacion", token, {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: EXP_COOKIE_AUTORIZACION,
  });

  next();
}

export async function emitirCookieCliente(res, { name, compra = null }) {

  const token = await generarJWT({ name, compra }, EXP_COOKIE_CLIENTE/1000 );

  res.cookie("cliente", token, {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: EXP_COOKIE_CLIENTE,
  });
}

//seteo la cookie de cliente
export async function setearCookieCliente(req, res, next) {
  const name = req.body?.name?.trim();
  const token = await generarJWT({
    name,
    compra: null,
  });

  if (!name) return res.redirect("/");

  await emitirCookieCliente(res, { name });

  next();
}



export function leerCookieCliente(req, res, next) {
  res.locals.cliente = null; //aca inicializo la variable de cliente para que siempre exista

  const token = req.cookies?.cliente; //leo la cookie

  if (token) {
    try {
      res.locals.cliente = jwt.verify(token, secret); //verifico el token y lo guardo en locals para poder usar el nombre despues
    } catch {
      //sino borra la cookie invalida
      res.clearCookie("cliente", { path: "/" });
      res.clearCookie("carrito", { path: "/" }); 
    }
  }
  next();
}

//si pasa el tiempo de expiracion devuelve al cliente al login
// Revisar si no deberíamos buscar en la req la cookie cliente
export function requerirCliente(req, res, next) {
  if (!res.locals.cliente){ 
    return res.redirect("/");
  }
  next();
}

export function requerirClienteApi(req, res, next) {
  if (!res.locals.cliente) {
    return res.status(401).json({ error: "Cliente no identificado" });
  }
  next();
}


export function requerirAutorizacion(req, res, next) {
  const token = req.cookies?.autorizacion;

  if (!token) {
    return res.redirect("/admin/login");
  }

  try {
    req.admin = jwt.verify(token, secret);
    return next();
  } catch (error) {
    res.clearCookie("autorizacion");
    return res.redirect("/admin/login");
  }
}

export function verificarCamposRequeridos(...campos) {
  return (req, res, next) => {
    const camposFaltantes = campos.filter((campo) => {
      const valor = req.body?.[campo];

      return typeof valor !== "string" || !valor.trim();
    });

    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        error: `Campos requeridos: ${camposFaltantes.join(", ")}`,
      });
    }

    next();
  };
}

export function validarSesionActiva(req, res, next) {
  const token = req.cookies?.autorizacion;

  if (!token) {
    return next();
  }

  try {
    jwt.verify(token, secret);

    res.status(200).json({
      mensaje: "Ya tenés una sesión activa",
    });
  } catch (error) {
    res.clearCookie("autorizacion", {
      path: "/",
    });

    return next();
  }
}

//Middelware carrito

export function leerCarrito(req) {
  try {
    const carrito = JSON.parse(req.cookies?.carrito ?? "[]");
    return Array.isArray(carrito) ? carrito : [];
  } catch {
    return [];
  }
}

export function guardarCarrito(res, carrito) {
  res.cookie("carrito", JSON.stringify(carrito), {
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    maxAge: EXP_COOKIE_CARRITO,
  });
}

//midelware si ya hizo una compra

export function requerirCompra(req, res, next) {
  if (!res.locals.cliente?.compra) return res.redirect("/carrito");
  next();
}

export function requerirCompraApi(req, res, next) {
  if (!res.locals.cliente?.compra) {
    return res.status(404).json({ error: "No se encontró la compra" });
  }
  next();
}


//middleware modo claro/oscuro

export function leerModo(req){
  try {
    const modo = req.cookies?.modo ?? "claro";
    return modo
  } catch {
    return "claro";
  }
}

export function guardarModo(res, modo) {
  res.cookie("modo", modo, {
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    maxAge: EXP_COOKIE_MODO,
  });
}