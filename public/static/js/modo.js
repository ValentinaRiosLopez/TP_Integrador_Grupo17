function $(id) {
  return document.getElementById(id);
}

const boton = $("btn-modo");

boton.addEventListener("click", async () => {
  const element = document.body;
  //element.classList.toggle("darkMode");
  const modo = element.classList.contains("darkMode") ? "claro" : "oscuro";
  const cambiado = await cambiarModo(modo);

  if (cambiado) {
    await actualizarPagina();
  }
});

async function cambiarModo(nuevoModo) {
  try {
    const response = await fetch("/api/modo", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        modo: nuevoModo,
      }),
    });

    if (!response.ok) {
      alert("Error al cambiar el modo");
      return false;
    }
    return true;
  } catch (ex) {
    alert("Fallo el cambio.");
    return false;
  }
}

async function traerModo() {
  try {
    const response = await fetch("/api/modo", { method: "GET" });

    if (response.ok) {
      try {
        const contenido = await response.json();
        return contenido;
      } catch (ex) {
        alert("No se pudo convertir.");
        return null;
      }
    } else {
      alert("Codigo respuesta: " + response.status);
      return null;
    }
  } catch (ex) {
    alert("Fallo la consulta.");
    return null;
  }
}

async function actualizarPagina() {
  const modoApi = await traerModo();
  if (modoApi === null) return;

  const modo = modoApi.trim();

  if (modo === "oscuro") {
    document.body.classList.add("darkMode");
    $("img-modo").src = "../public/static/iconos/lightmode.png";
  } else {
    document.body.classList.remove("darkMode");
    $("img-modo").src = "../public/static/iconos/darkmode.png";
  }
}

actualizarPagina();
