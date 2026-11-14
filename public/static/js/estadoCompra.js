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
            $("li-ticket").style.display = "block";
            $("link-ticket").href = `/ticket?venta=${compra}`;
        }

    }catch(e){
        //si falla queda todo como esta 
    }

}

consultarEstadoCompra();