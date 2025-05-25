// Clase para manejar la autenticación
class LoginService {
  constructor() {
    // URL base para la API real
    this.baseUrl = "https://tu-api-real.com/api" // Cambia esto a tu URL real
  }

  // Método para verificar credenciales de login
  async verifyCredentials(username, password) {
    try {
      console.log(`Verificando credenciales para: ${username}`)
      
      // Crear el objeto de datos en el formato requerido
      const loginData = {
        documentValue: username,
        password: password,
        web: true
      }
      
      // Realizar la petición POST con los datos en formato JSON
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      // Procesar la respuesta
      const baseResponse = await response.json()
      console.log("Respuesta del servidor:", baseResponse)
      
      // Verificar si la respuesta fue exitosa
      if (!baseResponse.success) {
        console.error("Error en la respuesta:", baseResponse.message || "Error desconocido")
        return null
      }
      
      // Devolver los datos de autenticación (AuthLoginResponseDTO)
      return baseResponse.data
    } catch (error) {
      console.error("Error al verificar credenciales:", error)
      throw error
    }
  }

  // Método para obtener datos con el token
  async fetchWithToken(url, options = {}) {
    const token = sessionStorage.getItem("authToken")
    
    if (!token) {
      throw new Error("No hay token de autenticación")
    }
    
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
    
    return fetch(url, {
      ...options,
      headers
    })
  }
}

// Exportar la clase para que esté disponible en otros archivos
if (typeof module !== "undefined" && module.exports) {
  module.exports = LoginService
} else {
  // Para navegadores sin soporte de módulos
  window.LoginService = LoginService
}