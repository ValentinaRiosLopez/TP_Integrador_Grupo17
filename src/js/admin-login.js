const formLogin = document.getElementById("form-login");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const btnAccesoRapido = document.getElementById("btn-acceso-rapido");
const loginError = document.getElementById("login-error");

// Acceso rápido para desarrollo
btnAccesoRapido.addEventListener("click", () => {
  inputEmail.value = "acceso_rapido@ejemplo.com";
  inputPassword.value = "demo123";
});

// loginError.textContent = "Cargando...";

// La autenticación se implementará más adelante
formLogin.addEventListener("submit", async (event) => {
  // Evita que el formulario navegue directamente a la respuesta JSON del endpoint
  event.preventDefault();

  const email = inputEmail.value;
  const password = inputPassword.value;

  loginError.textContent = "";

  console.log(email, password);

  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    console.log(data);
    if (!response.ok) {
      loginError.textContent = data.error;
      return;
    }

    window.location.href = "/admin/dashboard";
  } catch (error) {
    console.error(error);
    loginError.textContent = "Error al intentar loguear usuario";
  }
});
