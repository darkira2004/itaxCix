function clearSession() {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("loginTime");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("documentValue");
    sessionStorage.removeItem("userRoles");
    sessionStorage.removeItem("userPermissions");
    sessionStorage.removeItem("userAvailability");
    console.log("Sesión limpiada");
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    clearSession();
    
    // Mostrar credenciales de prueba en la consola
    console.log("=== CREDENCIALES DE PRUEBA ===");
    console.log("Documento: 73605624");
    console.log("Contraseña: 1234asdA@");
    console.log("===========================");
});