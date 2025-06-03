// Limpia todas las claves relevantes de sessionStorage y previene navegación hacia atrás tras cerrar sesión
function clearSession() {
    // Elimina solo las claves relacionadas con la sesión
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('loginTime');
    sessionStorage.removeItem('documentValue');
    sessionStorage.removeItem('userId');
    // Si tienes más claves de sesión, agrégalas aquí

    // Previene que el usuario navegue hacia atrás a páginas protegidas
    window.location.replace('../../index.html');
}

// Listener para eventos de navegación hacia atrás (popstate)
window.addEventListener('popstate', function(event) {
    // Si no hay sesión activa, redirige al login
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const token = sessionStorage.getItem('authToken');
    if (!isLoggedIn || !token) {
        window.location.replace('../../index.html');
    }
});

// Exporta la función para uso global
window.clearSession = clearSession;

// Nota: Ya no se limpia la sesión automáticamente al cargar la página.
// El llamado a clearSession() debe hacerse solo al cerrar sesión.
// El código de credenciales de prueba ha sido removido para producción.