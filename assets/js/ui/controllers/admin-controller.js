// Controlador para el panel de administración
document.addEventListener("DOMContentLoaded", () => {
  console.log("Inicializando panel de administración...")

  // Verificar autenticación
  if (!checkAuth()) {
    console.log("Usuario no autenticado, redirigiendo al login...")
    return // No continuar si no está autenticado
  }

  // Configurar el botón de cerrar sesión
  setupLogout()

  // Mostrar el nombre de usuario si está disponible
  displayUsername()

  console.log("Panel de administración inicializado correctamente")
})

// Configurar el botón de cerrar sesión
function setupLogout() {
  const logoutBtn = document.getElementById("logout-btn")

  if (logoutBtn) {
    console.log("Botón de logout encontrado, configurando evento...")

    logoutBtn.addEventListener("click", () => {
      console.log("Botón de logout clickeado")

      // Limpiar la sesión
      sessionStorage.removeItem("isLoggedIn")
      sessionStorage.removeItem("username")
      sessionStorage.removeItem("loginTime")

      console.log("Sesión eliminada, redirigiendo...")

      // Redirigir al login
      window.location.replace("../../index.html")
    })

    console.log("Botón de logout configurado correctamente")
  } else {
    console.warn("No se encontró el botón de logout con ID 'logout-btn'")

    // Intentar encontrar el botón por clase o por texto
    const logoutBtns = document.querySelectorAll(".btn-logout")
    if (logoutBtns.length > 0) {
      console.log("Botón de logout encontrado por clase, configurando evento...")

      logoutBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          console.log("Botón de logout clickeado")

          // Limpiar la sesión
          sessionStorage.removeItem("isLoggedIn")
          sessionStorage.removeItem("username")
          sessionStorage.removeItem("loginTime")

          console.log("Sesión eliminada, redirigiendo...")

          // Redirigir al login
          window.location.replace("../../index.html")
        })
      })

      console.log("Botones de logout configurados correctamente")
    } else {
      console.error("No se encontró ningún botón de logout en la página")
    }
  }
}

// Mostrar el nombre de usuario
function displayUsername() {
  const username = sessionStorage.getItem("username")
  const userDisplay = document.getElementById("user-display")

  if (userDisplay && username) {
    userDisplay.textContent = username
    console.log(`Nombre de usuario mostrado: ${username}`)
  }
}

// Prevenir el uso del botón de retroceso
window.addEventListener("pageshow", (event) => {
  // Si la página se carga desde la caché (botón de retroceso)
  if (event.persisted) {
    console.log("Página cargada desde caché, verificando autenticación...")
    checkAuth()
  }
})

// Función para cerrar sesión directamente (por si se llama desde otro lugar)
function doLogout() {
  console.log("Ejecutando logout...")

  // Limpiar la sesión
  sessionStorage.removeItem("isLoggedIn")
  sessionStorage.removeItem("username")
  sessionStorage.removeItem("loginTime")

  console.log("Sesión eliminada, redirigiendo...")

  // Redirigir al login
  window.location.replace("../../index.html")
}

// Exponer la función de logout globalmente
window.doLogout = doLogout

// Función para verificar la autenticación (simulada)
function checkAuth() {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true"
  if (!isLoggedIn) {
    console.log("Usuario no autenticado, redirigiendo al login...")
    window.location.replace("../../index.html")
    return false
  }
  return true
}
