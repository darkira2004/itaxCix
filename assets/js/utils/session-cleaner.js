/**
 * Maneja la limpieza de sesión y navegación
 */
function clearSession() {
    // Limpiar sessionStorage
    sessionStorage.clear();
    
    // Forzar redirección al login si no hay sesión válida
    if (!window.location.pathname.includes('index.html')) {
        window.location.replace('/index.html');
    }
}

// Prevenir navegación hacia atrás
function preventBackNavigation() {
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function() {
        window.history.pushState(null, '', window.location.href);
        checkSession();
    };
}

// Verificar estado de la sesión
function checkSession() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const token = sessionStorage.getItem('authToken');
    const loginTime = sessionStorage.getItem('loginTime');

    // Si no hay sesión válida y no estamos en login, redirigir
    if ((!isLoggedIn || !token || !loginTime) && !window.location.pathname.includes('index.html')) {
        clearSession();
        return false;
    }
    return true;
}

// Inicializar protección de navegación
document.addEventListener('DOMContentLoaded', function() {
    preventBackNavigation();
    checkSession();
});

// Verificar sesión periódicamente
setInterval(checkSession, 5000);

window.clearSession = clearSession;
window.checkSession = checkSession;