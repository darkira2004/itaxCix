/**
 * Verifica la autenticación del usuario mediante tokens y estado de sesión
 * @returns {boolean} true si el usuario está autenticado, false en caso contrario
 */
function checkAuthentication() {
    // Obtener estado de login y token de la sesión
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const token = sessionStorage.getItem("authToken");
    
    // Validar credenciales
    if (!isLoggedIn || !token) {
        console.log("Usuario no autenticado o token no encontrado, redirigiendo al login...");
        window.location.href = "../../index.html";
        return false;
    }
    
    return true;
}

/**
 * Actualiza la información del usuario en la interfaz
 * Prioriza mostrar el número de documento, si no está disponible muestra el ID
 */
function updateUserDisplay() {
    // Obtener datos del usuario de la sesión
    const documentValue = sessionStorage.getItem("documentValue");
    const userDisplay = document.getElementById("user-display");

    if (userDisplay) {
        if (documentValue) {
            // Mostrar número de documento si está disponible
            userDisplay.textContent = documentValue;
        } else {
            // Fallback: mostrar ID de usuario si el documento no está disponible
            const userId = sessionStorage.getItem("userId");
            if (userId) {
                userDisplay.textContent = "Usuario " + userId;
            }
        }
    }
}

/**
 * Verifica si la sesión ha expirado basado en el tiempo de inicio
 * La sesión expira después de 30 minutos de inactividad
 * @returns {boolean} true si la sesión es válida, false si ha expirado
 */
function checkTokenExpiration() {
    const loginTime = sessionStorage.getItem("loginTime");
    if (!loginTime) return false;
    
    // Calcular tiempo transcurrido desde el inicio de sesión
    const now = Date.now();
    const sessionTime = parseInt(loginTime);
    const sessionDuration = 30 * 60 * 1000; // 30 minutos en milisegundos
    
    // Verificar si la sesión ha expirado
    if (now - sessionTime > sessionDuration) {
        console.log("Sesión expirada, redirigiendo al login...");
        clearSession();
        window.location.href = "../../index.html";
        return false;
    }
    return true;
}

/**
 * Configura el evento de cierre de sesión en el botón de logout
 * Limpia la sesión y redirecciona al login cuando se hace click
 */
function setupLogoutButton() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(e) {
            e.preventDefault();
            clearSession(); // Función importada de session-cleaner.js
            window.location.href = "../../index.html";
        });
    }
}

/**
 * Exportar las funciones como un objeto global para uso en otros archivos
 * Esto permite acceder a las funciones desde cualquier parte de la aplicación
 */
window.authChecker = {
    checkAuthentication,
    updateUserDisplay,
    checkTokenExpiration,
    setupLogoutButton
};