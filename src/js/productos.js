async function cargarProductos() {
  try {
    const respuesta = await fetch("/api/productos");

    if (!respuesta.ok) {
      throw new Error("Error al obtener productos");
    }

    const productos = await respuesta.json();

    const contenedor = document.getElementById("lista-productos");
    contenedor.innerHTML = "";

    console.log(productos);

    if (productos.length === 0) {
      const mensajeVacio = document.createElement("h3");
      mensajeVacio.textContent = "No hay productos disponibles";

      contenedor.appendChild(mensajeVacio);
    } else {
      productos.forEach((producto) => {
        const tarjeta = document.createElement("div");

        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre;

        const descripcion = document.createElement("p");
        descripcion.textContent = producto.descripcion ?? "";

        const precio = document.createElement("p");
        precio.textContent = `$${producto.precio}`;

        const tipo = document.createElement("p");
        tipo.textContent = producto.tipo;

        tarjeta.append(nombre, descripcion, precio, tipo);

        contenedor.appendChild(tarjeta);
      });
    }
  } catch (error) {
    console.error(error);
  }
}

cargarProductos();
