const formulario = document.getElementById("form-alta-producto");
const modo = formulario.dataset.modo;
const productoId = formulario.dataset.id;

const vistaPrevia = document.getElementById("vista-previa-imagen");

let imagenActual = null;
let productoCargado = modo === "nuevo";

async function cargarProducto() {
  try {
    const respuesta = await fetch(`/api/admin/productos/${productoId}`);

    if (!respuesta.ok) {
      throw new Error("No se pudo recuperar el producto");
    }

    const producto = await respuesta.json();

    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("descripcion").value = producto.descripcion || "";
    document.getElementById("precio").value = producto.precio;
    document.getElementById("tipo").value = producto.tipo;

    imagenActual = producto.imagen;

    if (imagenActual) {
      vistaPrevia.src = imagenActual;
      vistaPrevia.hidden = false;
    }

    productoCargado = true;
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

if (modo === "editar") {
  cargarProducto();
}

async function subirImagen(archivo) {
  const formData = new FormData();
  formData.append("imagen", archivo);

  const respuesta = await fetch("/subirImagen", {
    method: "POST",
    body: formData,
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.error || "Error al subir la imagen");
  }

  return datos.imagen;
}

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!productoCargado) {
    alert("Todavía no se pudo cargar el producto");
    return;
  }

  try {
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;
    const tipo = document.getElementById("tipo").value;

    const archivo = document.getElementById("imagen").files[0];

    let rutaImagen = imagenActual;

    if (archivo) {
      rutaImagen = await subirImagen(archivo);
    }

    const esEdicion = modo === "editar";

    const ruta = esEdicion
      ? `/api/admin/productos/${productoId}`
      : "/api/admin/productos";

    const metodo = esEdicion ? "PUT" : "POST";

    const respuesta = await fetch(ruta, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        descripcion,
        precio,
        tipo,
        imagen: rutaImagen,
      }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.error || "Error al guardar el producto");
    }

    alert(
      esEdicion
        ? "Producto modificado correctamente"
        : "Producto creado correctamente",
    );

    window.location.href = "/admin/dashboard";
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});

document.getElementById("imagen").addEventListener("change", (event) => {
  const archivo = event.target.files[0];

  if (archivo) {
    vistaPrevia.src = URL.createObjectURL(archivo);
    vistaPrevia.hidden = false;
  } else {
    vistaPrevia.src = imagenActual || "";
    vistaPrevia.hidden = !imagenActual;
  }
});
