function $(id){return document.getElementById(id)};
function crearTexto(texto){return document.createTextNode(texto)};

async function traerDatosVenta(){
    const idVenta = new URLSearchParams(location.search).get("venta");
    let urlConsulta = "/api/venta/" + idVenta;

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

function formatearFecha(iso) {
  const fecha = new Date(iso);

  const dia = fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Argentina/Buenos_Aires",
  });

  const hora = fecha.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  });

  return `${dia} - ${hora} hs`;
}

async function llenarTicket(){
    const venta = await traerDatosVenta();

    $("id-compra").innerHTML = venta.id;
    $("nombre-cliente").innerHTML = venta.nombre_cliente;
    const fecha = formatearFecha(venta.fecha);

    $("fecha-compra").innerHTML = fecha;

    const tabla = $("detalle-productos");

    tabla.innerHTML = "";

    if (venta.items.length >= 0) {
        venta.items.forEach(item => {
            const fila = document.createElement("tr");

            const celdaCantidad = document.createElement("td");
            celdaCantidad.appendChild(crearTexto(item.cantidad));

            const celdaDescripcion = document.createElement("td");
            celdaDescripcion.className = "col-descripcion";
            celdaDescripcion.appendChild(crearTexto(item.producto.nombre));

            const celdaImporte = document.createElement("td");
            celdaImporte.className = "col-importe";
            celdaImporte.appendChild(crearTexto("$" + item.subtotal.toFixed(2)));

            fila.appendChild(celdaCantidad);
            fila.appendChild(celdaDescripcion);
            fila.appendChild(celdaImporte);

            tabla.appendChild(fila);
        });

        $("total-compra").textContent = "$" + venta.total.toFixed(2);
    }
}


llenarTicket();

//$("btn-descargar").addEventListener("click", descargarPdf());