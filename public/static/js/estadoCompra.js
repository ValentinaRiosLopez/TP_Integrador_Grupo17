
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
    }else{
      
    }

  }catch(e){
      //si falla queda todo como esta 
  }

}

consultarEstadoCompra();



