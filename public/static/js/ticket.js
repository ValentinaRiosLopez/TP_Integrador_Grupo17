
function $(id){return document.getElementById(id)};
function crearTexto(texto){return document.createTextNode(texto)};

async function traerDatosVenta(idVenta){
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


async function llenarTicket(){
    const id = new URLSearchParams(location.search).get("venta");
    //$("link-descarga").href = `/api/ticket/descargar/${id}`;
    const venta = await traerDatosVenta(id);

    if(!venta) return;

    $("id-compra").textContent = venta.id;
    $("nombre-cliente").textContent = venta.nombre_cliente;
    const fecha = venta.fecha;

    $("fecha-compra").textContent = fecha;

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

async function descargarPdf() {
  const id = new URLSearchParams(location.search).get("venta");
  const boton = $("btn-descargar");
  const textoOriginal = boton.textContent;

  boton.disabled = true; // evita lanzar dos PDFs con un doble clic
  boton.textContent = "Generando PDF...";

  try {
    const response = await fetch(`/api/ticket/descargar/${encodeURIComponent(id)}`);

    if (response.status === 401) {
      location.reload(); // la sesión venció: el servidor decide a dónde mandarlo
      return;
    }
    if (!response.ok) {
      alert("No se pudo generar el PDF.");
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = `factura-${id}.pdf`;
    enlace.click();
    URL.revokeObjectURL(url);
  } catch {
    alert("Falló la descarga.");
  } finally {
    boton.disabled = false;
    boton.textContent = textoOriginal;
  }
}

$("btn-descargar").addEventListener("click", descargarPdf);


llenarTicket();
