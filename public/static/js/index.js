function $(id){return document.getElementById(id)};

async function consultarEstadoCliente(){
    try {
        const response = await fetch("/api/cliente", {method: 'GET'});

        if (response.status === 401) {
        location.href = "/";
        return;
        }
        if (!response.ok) return;

        const { name } = await response.json();
        const ingreso = Boolean(name);

        if(!ingreso){
            $("panel-ingreso").style.display = "grid";
            $("contenido-cliente").style.display = "none";
            $("li-productos").style.display = "none";
            $("li-carrito").style.display = "none";
        }else{
           $("panel-ingreso").style.display = "none";
           $("contenido-cliente").style.display = "block"; 
           $("nombre-cliente").textContent = name;
           $("li-productos").style.display = "block";
           $("li-carrito").style.display = "block"; 
        }

    }catch(e){
        //si falla queda todo como esta 
    }

}

consultarEstadoCliente();