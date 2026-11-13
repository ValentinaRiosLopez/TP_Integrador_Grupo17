async function getProductos() {
  try {
    const url = window.location.pathname;

    const fetchProductos = async (ruta) => {
      const respuesta = await fetch(ruta, {
        method: "GET",
      });
      if (!respuesta.ok) {
        alert("Error al obtener productos");
        return;
      }

      const productos = await respuesta.json();
      console.log(productos);

      const listaDeProductos = document.getElementById("lista-productos");

      listaDeProductos.innerHTML = "";

      productos.forEach((producto) => {
        const nuevoProducto = document.createElement("div");
        nuevoProducto.className = `producto`;


        const imagenProducto = document.createElement("img");
        imagenProducto.className = `imagen-producto`;
        imagenProducto.src = producto.imagen || "";
        imagenProducto.alt = producto.nombre;

        const contenedorImagen = document.createElement("div");
        contenedorImagen.className = `imagen-producto-container`;
        contenedorImagen.appendChild(imagenProducto);

        const textoProducto = document.createElement("div");
        textoProducto.className = `texto-producto`;

        const nombreProducto = document.createElement("h3");
        nombreProducto.className = `nombre-producto`;
        nombreProducto.textContent = producto.nombre;

        const descripcionProducto = document.createElement("p");
        descripcionProducto.className = `descripcion-producto`;
        descripcionProducto.textContent = producto.descripcion || "";

        const precioProducto = document.createElement("p");
        precioProducto.className = `precio-producto`;
        precioProducto.textContent = `$${producto.precio}`;

        textoProducto.append(
          nombreProducto,
          descripcionProducto,
          precioProducto,
        );

        // Carrito
        const seccionAgregar = document.createElement("div");
        seccionAgregar.className = `seccion-agregar`;

        const formulario = document.createElement("form");
        formulario.className = `form-agregar`;
        formulario.action = "/carrito";
        formulario.method = "POST";

        const inputId = document.createElement("input");
        inputId.type = "hidden";
        inputId.name = "productoId";
        inputId.value = producto.id;

        const cantidad = document.createElement("input");
        cantidad.type = "number";
        cantidad.name = "cantidad";
        cantidad.value = 1;
        cantidad.min = 1;
        cantidad.max = 10;

        const boton = document.createElement("button");
        boton.type = "submit";
        boton.textContent = "Agregar al carrito";

        formulario.append(inputId, cantidad, boton);
        seccionAgregar.appendChild(formulario);

        // Agrego todos los elementos al producto
        nuevoProducto.append(contenedorImagen, textoProducto, seccionAgregar);

        // Agrego el producto al listado
        listaDeProductos.appendChild(nuevoProducto);
      });
    };

    if (url === "/productos/juegos") {
        await fetchProductos("/api/productos/juegos");
    } else if (url === "/productos/dados") {
        await fetchProductos("/api/productos/dados");
    } else {
      await fetchProductos("/api/productos");
    }
  } catch (error) {
    console.error("Error al obtener productos:", error);
  }
}
