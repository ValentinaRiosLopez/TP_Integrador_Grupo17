

export const recargarPagina = (req, res) => {
  res.redirect("/");
};

export const borrarCookies = (req, res) => {
  res.clearCookie("carrito");
  res.clearCookie("cliente", { path: "/" });
  res.redirect("/");
};

export const getCookieCliente = (req, res) => {
  const cliente = res.locals.cliente;
  res.status(200).json({
    name: cliente?.name ?? null,
    compra: cliente?.compra ?? null,
  });
};

export default {
    recargarPagina,
    borrarCookies,
    getCookieCliente
};