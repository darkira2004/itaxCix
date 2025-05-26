function clearSession() {  // Limpiar sessionStorage
    sessionStorage.clear();
    
    // Prevenir navegación hacia atrás
     window.history.forward();
}

// Agregar listeners para eventos de navegación
window.addEventListener('popstate', function(event) {
    // Si no estamos en la página de login, redirigir
    if (!window.location.href.includes('index.html')) {
        window.location.replace('../../index.html');
    }
});

// Verificar estado de autenticación al cargar
document.addEventListener('DOMContentLoaded', function() {
    clearSession();
    
    // Mostrar credenciales de prueba en laz consola
    console.log("=== CREDENCIALES DE PRUEBA ===");
    console.log("Documento: 73605624");
    console.log("Contraseña: 1234asdA@");
    console.log("===========================");
});