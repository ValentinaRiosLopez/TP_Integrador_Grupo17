const PRODS_POR_PAGINA = 6;
let productos = [];
let paginaActual = 1;

function rutaApi() {
  const url = window.location.pathname;
  if (url === "/productos/juegos") return "/api/productos/juegos";
  if (url === "/productos/dados") return "/api/productos/dados";
  return "/api/productos";
}

async function traerProductos() {
  try {
    const respuesta = await fetch(rutaApi());

    if (respuesta.status === 401) {
      location.reload(); // la sesión venció: el servidor decide a dónde mandarlo
      return null;
    }
    if (!respuesta.ok) {
      alert("Error al obtener productos");
      return null;
    }

    return await respuesta.json();
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return null;
  }
}

function crearTarjeta(producto) {
  const nuevoProducto = document.createElement("div");
  nuevoProducto.className = "producto";

  const imagenProducto = document.createElement("img");
  imagenProducto.className = "imagen-producto";
  if (producto.imagen) imagenProducto.src = producto.imagen;
  imagenProducto.alt = producto.nombre;

  const contenedorImagen = document.createElement("div");
  contenedorImagen.className = "imagen-producto-container";
  contenedorImagen.appendChild(imagenProducto);

  const textoProducto = document.createElement("div");
  textoProducto.className = "texto-producto";

  const nombreProducto = document.createElement("h3");
  nombreProducto.className = "nombre-producto";
  nombreProducto.textContent = producto.nombre;

  const descripcionProducto = document.createElement("p");
  descripcionProducto.className = "descripcion-producto";
  descripcionProducto.textContent = producto.descripcion || "";

  const precioProducto = document.createElement("p");
  precioProducto.className = "precio-producto";
  precioProducto.textContent = `$${producto.precio}`;

  textoProducto.append(nombreProducto, descripcionProducto, precioProducto);

  // Carrito
  const seccionAgregar = document.createElement("div");
  seccionAgregar.className = "seccion-agregar";

  const formulario = document.createElement("form");
  formulario.className = "form-agregar";
  formulario.action = "/carrito";
  formulario.method = "POST";

  const inputId = document.createElement("input");
  inputId.type = "hidden";
  inputId.name = "productoId";
  inputId.value = producto.id;

  const cantidad = document.createElement("input");
  cantidad.type = "number";
  cantidad.name = "cantidad";
  cantidad.value = 1;
  cantidad.min = 1;
  cantidad.max = 10;

  const boton = document.createElement("button");
  boton.type = "submit";
  boton.textContent = "Agregar al carrito";

  formulario.append(inputId, cantidad, boton);
  seccionAgregar.appendChild(formulario);

  nuevoProducto.append(contenedorImagen, textoProducto, seccionAgregar);
  return nuevoProducto;
}

function leerPaginaUrl() {
  const n = parseInt(new URLSearchParams(location.search).get("pagina"), 10);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

function actualizarControles(actual, total) {
  document.getElementById("paginacion").hidden = total <= 1;
  document.getElementById("pag-actual").textContent = actual;
  document.getElementById("pag-total").textContent = total;
  document.getElementById("pag-anterior").disabled = actual === 1;
  document.getElementById("pag-siguiente").disabled = actual === total;
}

function mostrarPagina(pagPedida) {
  const lista = document.getElementById("lista-productos");

  if (productos.length === 0) {
    const aviso = document.createElement("p");
    aviso.textContent = "No hay productos disponibles.";
    lista.replaceChildren(aviso);
    actualizarControles(1, 1);
    return;
  }

  const total = Math.ceil(productos.length / PRODS_POR_PAGINA);

  paginaActual = Math.min(Math.max(1, pagPedida), total);

  const inicio = (paginaActual - 1) * PRODS_POR_PAGINA;

  lista.replaceChildren(
    ...productos.slice(inicio, inicio + PRODS_POR_PAGINA).map(crearTarjeta),
  );

  actualizarControles(paginaActual, total);
}

function irAPagina(pagina) {
  const url = new URL(location.href);
  url.searchParams.set("pagina", pagina);

  history.pushState({}, "", url.href);

  mostrarPagina(pagina);
}

async function iniciar() {
  const datos = await traerProductos();
  if (!datos) return;

  productos = datos;
  mostrarPagina(leerPaginaUrl());
}

document
  .getElementById("pag-anterior")
  .addEventListener("click", () => irAPagina(paginaActual - 1));
document
  .getElementById("pag-siguiente")
  .addEventListener("click", () => irAPagina(paginaActual + 1));

window.addEventListener("popstate", () => mostrarPagina(leerPaginaUrl()));

window.getProductos = iniciar;
