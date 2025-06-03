/**
 * Verifica la autenticación del usuario mediante tokens y estado de sesión.
 * Si no está autenticado, redirige al login.
 * @returns {boolean} true si el usuario está autenticado, false en caso contrario
 */
function checkAuthentication() {
    // Verifica si el usuario está logueado y si existe un token en sessionStorage
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const token = sessionStorage.getItem("authToken");
    
    // Si no está logueado o no hay token, redirige al login
    if (!isLoggedIn || !token) {
        console.log("Usuario no autenticado o token no encontrado, redirigiendo al login...");
        window.location.href = "../../index.html";
        return false;
    }
    // Si pasa la validación, retorna true
    return true;
}

/**
 * Actualiza la información del usuario en la interfaz.
 * Muestra el número de documento si está disponible, si no muestra el ID de usuario.
 */
function updateUserDisplay() {
    // Obtiene el número de documento del usuario desde sessionStorage
    const documentValue = sessionStorage.getItem("documentValue");
    // Obtiene el elemento donde se muestra el usuario
    const userDisplay = document.getElementById("user-display");

    if (userDisplay) {
        if (documentValue) {
            // Si hay documento, lo muestra
            userDisplay.textContent = documentValue;
        } else {
            // Si no, muestra el ID de usuario como fallback
            const userId = sessionStorage.getItem("userId");
            if (userId) {
                userDisplay.textContent = "Usuario " + userId;
            }
        }
    }
}

/**
 * Verifica si la sesión ha expirado basado en el tiempo de inicio.
 * La sesión expira después de 30 minutos de inactividad.
 * Si expira, limpia la sesión y redirige al login.
 * @returns {boolean} true si la sesión es válida, false si ha expirado
 */
function checkTokenExpiration() {
    // Obtiene el tiempo de inicio de sesión
    const loginTime = sessionStorage.getItem("loginTime");
    if (!loginTime) return false;
    
    // Calcula el tiempo transcurrido desde el inicio de sesión
    const now = Date.now();
    const sessionTime = parseInt(loginTime);
    const sessionDuration = 30 * 60 * 1000; // 30 minutos en milisegundos
    
    // Si la sesión ha expirado, limpia y redirige
    if (now - sessionTime > sessionDuration) {
        console.log("Sesión expirada, redirigiendo al login...");
        clearSession();
        window.location.href = "../../index.html";
        return false;
    }
    // Si la sesión sigue activa, retorna true
    return true;
}

/**
 * Configura el evento de cierre de sesión en el botón de logout.
 * Al hacer click, limpia la sesión y redirige al login.
 */
function setupLogoutButton() {
    // Busca el botón de logout en la interfaz
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(e) {
            e.preventDefault(); // Previene el comportamiento por defecto
            clearSession(); // Limpia la sesión (debe estar definida en session-cleaner.js)
            window.location.href = "../../index.html"; // Redirige al login
        });
    }
}

/**
 * Exporta las funciones como un objeto global para uso en otros archivos.
 * Permite acceder a las funciones desde cualquier parte de la aplicación.
 */
window.authChecker = {
    checkAuthentication,
    updateUserDisplay,
    checkTokenExpiration,
    setupLogoutButton
};