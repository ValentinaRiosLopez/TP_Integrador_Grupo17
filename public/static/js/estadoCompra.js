function $(id){return document.getElementById(id)};

//consulta si ya se realizo una compra
async function consultarEstadoCompra(){
    try {
        const response = await fetch("/api/cliente");

        if (response.status === 401) {
        location.href = "/";
        return;
        }
        if (!response.ok) return;

        const { compra } = await response.json();
        const finalizada = Boolean(compra);

        if(finalizada){
            $("li-productos").style.display = "none";
            $("li-carrito").style.display = "none";
            $("productos-destacados").style.display = "none";
            $("li-ticket").style.display = "block";
            $("link-ticket").href = `/ticket?venta=${compra}`;
        }

    }catch(e){
        //si falla queda todo como esta 
    }

}

consultarEstadoCompra();


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
