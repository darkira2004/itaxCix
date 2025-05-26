/**
 * Configuración de rutas base según el entorno
 */
const BASE_URL = window.location.hostname.includes('github.io') 
    ? '/itaxCix'  // Ruta base para GitHub Pages
    : '';         // Ruta base para desarrollo local

/**
 * Maneja la limpieza de sesión y navegación
 */
function clearSession() {
    // Limpiar sessionStorage
    sessionStorage.clear();
    
    // Forzar redirección al login con la ruta base correcta
    if (!window.location.pathname.includes('index.html')) {
        window.location.replace(`${BASE_URL}/index.html`);
    }
}

/**
 * Verifica el estado de la sesión
 */
function checkSession() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const token = sessionStorage.getItem('authToken');
    const loginTime = sessionStorage.getItem('loginTime');

    // Si no hay sesión válida y no estamos en login, redirigir
    if ((!isLoggedIn || !token || !loginTime) && !window.location.pathname.includes('index.html')) {
        clearSession();
        return false;
    }

    // Prevenir navegación hacia atrás
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function() {
        window.history.pushState(null, '', window.location.href);
        window.location.replace(`${BASE_URL}/index.html`);
    };

    return true;
}

// Inicializar verificación de sesión
document.addEventListener('DOMContentLoaded', checkSession);

// Verificar sesión periódicamente
setInterval(checkSession, 5000);

// Exportar funciones
window.clearSession = clearSession;
window.checkSession = checkSession;