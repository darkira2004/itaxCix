/**
 * Maneja la limpieza de sesión y navegación
 */
function clearSession() {
    // Limpiar todo el sessionStorage
    sessionStorage.clear();
    
    // Prevenir navegación hacia atrás
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, '', window.location.href);
    };

    // Redirigir solo si no estamos en el login y hay una sesión previa
    const currentPath = window.location.pathname;
    if (!currentPath.includes('index.html') && !sessionStorage.getItem('isLoggedIn')) {
        console.log('Sesión no válida, redirigiendo al login...');
        window.location.replace('../../index.html');
    }
}

// Verificar autenticación al cargar cualquier página
document.addEventListener('DOMContentLoaded', function() {
    // Si estamos en el login, solo limpiar la sesión
    if (window.location.pathname.includes('index.html')) {
        sessionStorage.clear();
        return;
    }

    // Para otras páginas, verificar autenticación
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const hasToken = sessionStorage.getItem('authToken');
    
    if (!isLoggedIn || !hasToken) {
        clearSession();
    }
});

// Exportar la función para uso en otros archivos
window.clearSession = clearSession;