function $(id){return document.getElementById(id)};

let nombreCliente;

function guardarNombre(){

    nombre = $("nombre-cliente").value;
    console.log(nombre);

    if(nombre != ""){
        $("panel-ingreso").style.display = "none";
        $("inicio").style.display = "block";
        $("li-productos").style.display = "block";
        $("li-carrito").style.display = "block";
        nombreCliente = nombre;
    }else{
        $("error-nombre").style.display = "block";
    }
    
   
}

if(nombreCliente == undefined){
    $("panel-ingreso").style.display = "grid";
    $("inicio").style.display = "none";
    $("li-productos").style.display = "none";
    $("li-carrito").style.display = "none";    
}


$("btn-ingreso").addEventListener("click", guardarNombre);