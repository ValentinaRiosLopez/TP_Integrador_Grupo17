async function actualizarContadorCarrito() {
  const contador = document.getElementById("cantidad-carrito");

  if (!contador) return;

  try {
    const respuesta = await fetch("/api/carrito");

    if (!respuesta.ok) {
      contador.hidden = true;
      return;
    }

    const carrito = await respuesta.json();

    const cantidadTotal = carrito.items.reduce(
      (total, item) => total + item.cantidad,
      0
    );

    contador.textContent = cantidadTotal;
    contador.hidden = cantidadTotal === 0;

  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    contador.hidden = true;
  }
}

actualizarContadorCarrito();