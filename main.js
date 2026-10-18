function $(id){return document.getElementById(id)};



function guardarNombre(evento){

    nombre = $("txt-nombre").value;
    console.log(nombre);

    if(nombre != ""){
        localStorage.setItem("nombreCliente", nombre);
        $("nombre-cliente").appendChild(document.createTextNode(nombre));
        mostrarInicio();
    }else{
        $("error-nombre").style.display = "block";
    }
    
   
}

function actualizarInicio(){
    let nombre = localStorage.getItem("nombreCliente");

    if(nombre === null){
        mostrarFormularioNombre();    
    }else{
        $("nombre-cliente").appendChild(document.createTextNode(nombre));
        mostrarInicio();
    }
}

function borrarNombre(event){
    localStorage.removeItem("nombreCliente");
    $("nombre-cliente").innerHTML = "";
    mostrarFormularioNombre();
}

function mostrarFormularioNombre(){
    $("panel-ingreso").style.display = "grid";
    $("panel-cliente").style.display = "none";
    $("inicio").style.display = "none";
    $("li-productos").style.display = "none";
    $("li-carrito").style.display = "none"; 
}

function mostrarInicio(){
    $("panel-ingreso").style.display = "none";
    $("panel-cliente").style.display = "block";
    $("inicio").style.display = "block";
    $("li-productos").style.display = "block";
    $("li-carrito").style.display = "block";
}


actualizarInicio();

$("btn-ingreso").addEventListener("click", guardarNombre);
$("btn-salir").addEventListener("click", borrarNombre);