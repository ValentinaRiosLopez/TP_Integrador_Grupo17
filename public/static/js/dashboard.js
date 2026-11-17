document.querySelectorAll(".btn-editar-producto").forEach((boton) => {
  boton.addEventListener("click", () => {
    const id = boton.dataset.id;

    window.location.href = `/admin/productos/${id}/editar`;
  });
});


const modal = document.getElementById("modal-confirmacion");
const tituloModal = document.getElementById("titulo-modal");
const mensajeModal = document.getElementById("mensaje-modal");
const btnCancelar = document.getElementById("btn-cancelar");
const btnConfirmar = document.getElementById("btn-confirmar");

let productoSeleccionado = null;
let accionSeleccionada = null;

document
  .querySelectorAll(
    ".btn-eliminar-producto, .btn-disponibilizar-producto"
  )
  .forEach((boton) => {
    boton.addEventListener("click", () => {
      productoSeleccionado = boton.dataset.id;

      const nombreProducto = boton.dataset.nombre;

      if (boton.classList.contains("btn-eliminar-producto")) {
        accionSeleccionada = "eliminar";

        tituloModal.textContent = "Eliminar producto";
        mensajeModal.textContent =
          `¿Estás seguro de que querés eliminar "${nombreProducto}"?`;
      } else {
        accionSeleccionada = "activar";

        tituloModal.textContent = "Disponibilizar producto";
        mensajeModal.textContent =
          `¿Estás seguro de que querés disponibilizar "${nombreProducto}"?`;
      }

      modal.showModal();
    });
  });

btnCancelar.addEventListener("click", () => {
  modal.close();
});

btnConfirmar.addEventListener("click", async () => {
  if (!productoSeleccionado || !accionSeleccionada) return;

  btnConfirmar.disabled = true;

  try {
    let ruta;
    let metodo;

    if (accionSeleccionada === "eliminar") {
      ruta = `/api/admin/productos/${productoSeleccionado}`;
      metodo = "DELETE";
    } else {
      ruta = `/api/admin/productos/${productoSeleccionado}/activar`;
      metodo = "PUT";
    }

    const respuesta = await fetch(ruta, {
      method: metodo,
    });

    if (respuesta.redirected) {
      window.location.href = respuesta.url;
      return;
    }

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.error || "Error al modificar el producto");
    }

    modal.close();
    window.location.reload();

  } catch (error) {
    console.error(error);
    alert(error.message);
  } finally {
    btnConfirmar.disabled = false;
  }
});

modal.addEventListener("close", () => {
  productoSeleccionado = null;
  accionSeleccionada = null;
});
