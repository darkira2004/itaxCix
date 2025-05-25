// assets/js/api/services/mock-login-service.js

class MockLoginService {
  constructor() {
    console.log("Inicializando servicio de login simulado");
  }

  async verifyCredentials(username, password) {
    console.log(`Simulando verificación de credenciales para: ${username}`);
    
    // Simular un retraso de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Credenciales de prueba
    if (username === "73605624" && password === "1234asdA@") {
      console.log("Credenciales válidas, generando respuesta simulada");
      
      // Simular la respuesta de la API
      return {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlVzdWFyaW8gZGUgUHJ1ZWJhIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        userId: 12345,
        documentValue: "73605624",
        roles: ["admin", "user"],
        permissions: ["read", "write", "approve_drivers"],
        availability: true
      };
    } else {
      console.log("Credenciales inválidas");
      return null;
    }
  }

  // Método para simular peticiones autenticadas
  async fetchWithToken(url, options = {}) {
    const token = sessionStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No hay token de autenticación");
    }
    
    console.log(`Simulando petición autenticada a: ${url}`);
    console.log(`Token utilizado: ${token}`);
    
    // Simular un retraso de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simular una respuesta exitosa
    return {
      ok: true,
      json: async () => ({ success: true, data: { message: "Datos obtenidos correctamente" } })
    };
  }
}

// Exportar la clase para que esté disponible en otros archivos
if (typeof module !== "undefined" && module.exports) {
  module.exports = MockLoginService;
} else {
  // Para navegadores sin soporte de módulos
  window.LoginService = MockLoginService;
}