document.querySelectorAll(".btn-editar-producto").forEach((boton) => {
  boton.addEventListener("click", () => {
    const id = boton.dataset.id;

    window.location.href = `/admin/productos/${id}/editar`;
  });
});


document.querySelectorAll(".btn-eliminar-producto").forEach((boton) => {

  boton.addEventListener("click", async () => {
    const id = boton.dataset.id;

    const confirmar = confirm(
      "¿Estás seguro de que querés desactivar este producto?"
    );

    if (!confirmar) return;

    try {
      const respuesta = await fetch(`/api/admin/productos/${id}`, {
        method: "DELETE",
      });

      if (respuesta.redirected) {
        window.location.href = respuesta.url;
        return;
      }

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || "Error al eliminar producto");
      }

      alert(datos.mensaje);

      window.location.reload();

    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  });

});
