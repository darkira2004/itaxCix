// Función para manejar el inicio de sesión
function setupLoginForm() {
  console.log("Configurando formulario de login...");

  // Verificar que LoginService esté disponible
  if (typeof LoginService === "undefined") {
    console.error(
      "Error: LoginService no está definido. Asegúrate de cargar login-service.js antes que login-controller.js",
    );
    return;
  }

  const apiService = new LoginService(); // Usar el servicio de API
  const loginForm = document.querySelector(".login-form");
  const errorMsg = document.getElementById("error-msg");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault(); // Prevenir el envío del formulario
      console.log("Formulario enviado");

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
      console.log(`Intentando login con usuario: ${username}`);

      // Mostrar indicador de carga (opcional)
      const submitButton = this.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = "Verificando...";
      submitButton.disabled = true;

      try {
        // Intentar iniciar sesión usando el servicio de API
        console.log("Verificando credenciales...");
        const authData = await apiService.verifyCredentials(username, password);

        // Verificar si la respuesta contiene datos de autenticación
        if (authData && authData.token) {
          console.log("Login exitoso, token recibido");
          
          // Guardar el token en sessionStorage
          sessionStorage.setItem("authToken", authData.token);
          
          // Guardar la sesión
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("loginTime", Date.now().toString());
          
          // Guardar datos adicionales del usuario
          sessionStorage.setItem("userId", authData.userId.toString());
          sessionStorage.setItem("documentValue", authData.documentValue);
          
          // Guardar roles y permisos
          if (authData.roles && authData.roles.length > 0) {
            sessionStorage.setItem("userRoles", JSON.stringify(authData.roles));
          }
          
          if (authData.permissions && authData.permissions.length > 0) {
            sessionStorage.setItem("userPermissions", JSON.stringify(authData.permissions));
          }
          
          // Guardar disponibilidad si existe
          if (authData.availability !== null) {
            sessionStorage.setItem("userAvailability", authData.availability.toString());
          }

          // Redirigir al panel de administración
          window.location.href = "pages/usuarios/ControlAdmisionConductores.html";
        } else {
          console.log("Credenciales incorrectas o respuesta inválida");
          // Mostrar mensaje de error
          errorMsg.style.display = "block";
          passwordInput.value = ""; // Limpiar contraseña por seguridad
        }
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        errorMsg.textContent = "Error al conectar con el servidor";
        errorMsg.style.display = "block";
      } finally {
        // Restaurar el botón
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      }
    });
    console.log("Formulario de login configurado correctamente");
  } else {
    console.warn("No se encontró el formulario de login");
  }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado, inicializando aplicación...");
  setupPasswordToggle();
  setupLoginForm();
  setupForgotPassword();
});

// Función para mostrar/ocultar contraseña
function setupPasswordToggle() {
  console.log("Configurando toggle de contraseña...");
  const togglePassword = document.getElementById("togglePassword");
  const password = document.getElementById("password");

  if (togglePassword && password) {
    togglePassword.addEventListener("click", function () {
      // Cambiar el tipo de input
      const type = password.getAttribute("type") === "password" ? "text" : "password";
      password.setAttribute("type", type);

      // Cambiar el icono
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });
    console.log("Toggle de contraseña configurado correctamente");
  } else {
    console.warn("No se encontraron los elementos para el toggle de contraseña");
  }
}

// Función para configurar el enlace de contraseña olvidada
function setupForgotPassword() {
  const forgotPasswordLink = document.querySelector(".contraseña-olvidada");

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", () => {
      alert("Funcionalidad de recuperación de contraseña en desarrollo. Por favor contacte al administrador.");
    });
  }
}