function $(id){return document.getElementById(id)};
function crearTexto(texto){return document.createTextNode(texto)};


async function traerCarrito(){
    let urlConsulta = "/api/carrito";

    try {
        const response = await fetch(urlConsulta, {method: 'GET'}); 
        
        if(response.ok){
            try {
                const contenido = await response.json();
                return contenido;
            }catch(ex){
                alert("No se pudo convertir.");
            }
        }else{
            alert("Codigo respuesta: " + response.status);
        }
        
    }catch(ex){
        alert("Fallo la consulta.");
    }
}

async function actualizarCantidad(id, input) {
  // normaliza lo que escribió el usuario
  let valor = parseInt(input.value);
  if (!Number.isInteger(valor)) valor = 1;
  valor = Math.min(10, Math.max(1, valor));
  input.value = valor;

  try {
    const response = await fetch(`/api/carrito/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantidad: valor }),
    });

    if (response.status === 401) {
      location.href = "/";
      return;
    }
    if (!response.ok) {
      const { error } = await response.json().catch(() => ({}));
      alert(error || "No se pudo actualizar la cantidad");
    }
  } catch {
    alert("Falló la actualización.");
  }

  llenarCarrito(); // refresca importes y total con los datos del servidor
}

async function eliminarProducto(id) {
  try {
    const response = await fetch(`/api/carrito/${id}`, { method: "DELETE" });

    if (response.status === 401) {
      location.href = "/";
      return;
    }
    if (!response.ok) {
      const { error } = await response.json().catch(() => ({}));
      alert(error || "No se pudo eliminar el producto");
    }
  } catch {
    alert("Falló la eliminación.");
  }

  llenarCarrito();
}


async function llenarCarrito(){
    const {items, total} = await traerCarrito();
    const tabla = $("productos-carrito");

    tabla.innerHTML = "";

    if (items.length === 0) {
        const fila = document.createElement("tr");
        const celda = document.createElement("td")
        celda.appendChild(crearTexto("El carrito esta vacio."))
        celda.colSpan = 3;
        fila.appendChild(celda);
        tabla.appendChild(fila);
    }else{
        items.forEach(item => {
            const fila = document.createElement("tr");

            const celdaCantidad = document.createElement("td");
            const cantidad = document.createElement("input");
            cantidad.type = "number";
            cantidad.name = "cantidad";
            cantidad.value = item.cantidad;
            cantidad.min = 1;
            cantidad.max = 10;
            cantidad.addEventListener("change", () => actualizarCantidad(item.producto.id, cantidad));

            celdaCantidad.appendChild(cantidad);

            const celdaDescripcion = document.createElement("td");
            celdaDescripcion.className = "col-descripcion";
            celdaDescripcion.appendChild(crearTexto(item.producto.nombre));

            const celdaImporte = document.createElement("td");
            celdaImporte.className = "col-importe";
            celdaImporte.appendChild(crearTexto("$" + item.subtotal.toFixed(2)));

            const celdaEliminar = document.createElement("td");
            const btnEliminar = document.createElement("button");
            btnEliminar.innerHTML = "Eliminar";
            btnEliminar.addEventListener("click", ()=>{ eliminarProducto(item.producto.id) });
            celdaEliminar.appendChild(btnEliminar);
            celdaEliminar.className = "eliminar-producto";


            fila.appendChild(celdaCantidad);
            fila.appendChild(celdaDescripcion);
            fila.appendChild(celdaImporte);
            fila.appendChild(celdaEliminar);

            tabla.appendChild(fila);
        });
    }


    $("total-compra").textContent = "$" + total.toFixed(2);
    
}

async function vaciarCarrito(){
  try {
    const response = await fetch("/carrito/vaciar", { method: "DELETE" });

    if (response.status === 401) {
      location.href = "/";
      return;
    }
    if (!response.ok) {
      alert("No se pudo vaciar el carrito");
    }
  } catch {
    alert("Falló el vaciado.");
  }

  llenarCarrito();
}

async function realizarCompra(){
  $("btn-comprar").disabled = true;
  $("btn-vaciar").disabled = true;

  try {
    const response = await fetch("/api/carrito/comprar", { method: "POST" });

    //si no esta identificado el cliente
    if (response.status === 401) {
      location.href = "/";
      return;
    }

    if (response.status === 400) {
      alert("Error carrito vacio.");
      return;
    }

    if (!response.ok) {
      alert("Error en la compra.");
      $("btn-comprar").disabled = false;
      $("btn-vaciar").disabled = false;
    }

    location.href = `/ticket`;
  } catch {
    alert("Error en la compra.");
    $("btn-comprar").disabled = false;
    $("btn-vaciar").disabled = false;
    
  }  
}

$("btn-vaciar").addEventListener("click",()=>{ vaciarCarrito() });
$("btn-comprar").addEventListener("click", ()=>{realizarCompra()})
llenarCarrito();