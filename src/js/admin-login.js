
const formLogin = document.getElementById("form-login");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const btnAccesoRapido = document.getElementById("btn-acceso-rapido");
const loginError = document.getElementById("login-error");

// Acceso rápido para desarrollo
btnAccesoRapido.addEventListener("click", () => {
  inputEmail.value = "admin@ejemplo.com";
  inputPassword.value = "demo123";
});

// La autenticación se implementará más adelante
formLogin.addEventListener("submit", (event) => {
  event.preventDefault();

  loginError.textContent =
    "Completar.";
});
