// Servicio para manejar la recuperación de contraseñas
class PasswordRecoveryService {
    constructor() {
        this.baseUrl = "https://149.130.161.148/api/v1";
        console.log('PasswordRecoveryService inicializado');
    }    /**
     * Solicita el envío de un enlace de recuperación de contraseña
     * @param {string} contactValue - Correo electrónico o número de teléfono del usuario
     * @param {string} contactType - Tipo de contacto ('email' o 'phone')
     * @returns {Promise<Object>} - Respuesta de la API
     */
    async requestPasswordReset(contactValue, contactType = 'phone') {
        try {
            console.log(`Solicitando recuperación de contraseña para ${contactType}: ${contactValue}`);
            
            const url = `${this.baseUrl}/auth/recovery/start`;
            
            // Determinar contactTypeId según el tipo
            const contactTypeId = contactType === 'email' ? 1 : 2;
            
            let formattedContactValue;
            if (contactType === 'phone') {
                formattedContactValue = this.formatPhoneNumber(contactValue.trim());
            } else {
                formattedContactValue = contactValue.trim().toLowerCase();
            }
            
            const requestBody = {
                contactTypeId,
                contactValue: formattedContactValue
            };

            console.log('Enviando datos:', requestBody);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const responseData = await response.json();
            console.log('Respuesta del servidor:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || `Error HTTP: ${response.status}`);
            }

            // Verificar si la respuesta fue exitosa
            if (responseData.success === false) {
                throw new Error(responseData.message || 'Error al solicitar recuperación de contraseña');
            }

            const contactMethod = contactType === 'email' ? 'correo electrónico' : 'número de teléfono';
            return {
                success: true,
                message: `Se ha enviado un código de recuperación a tu ${contactMethod}.`,
                data: responseData.data || null
            };

        } catch (error) {
            console.error('Error al solicitar recuperación de contraseña:', error);
            
            return {
                success: false,
                message: error.message || 'Error interno del servidor. Inténtalo más tarde.',
                data: null
            };
        }
    }    /**
     * Valida el formato del correo electrónico
     * @param {string} email - Correo electrónico a validar
     * @returns {boolean} - true si es válido, false si no
     */
    validateEmailFormat(email) {
        if (!email || typeof email !== 'string') {
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    /**
     * Valida el formato del número de teléfono
     * @param {string} phoneNumber - Número de teléfono a validar
     * @returns {boolean} - true si es válido, false si no
     */
    validatePhoneFormat(phoneNumber) {
        if (!phoneNumber || typeof phoneNumber !== 'string') {
            return false;
        }

        const cleaned = phoneNumber.trim();
        
        // Remover espacios y caracteres especiales para validar solo números
        const numbersOnly = cleaned.replace(/[\s\-\(\)\+]/g, '');
        
        // Verificar que tenga entre 9 y 15 dígitos (estándar internacional)
        const isValidLength = numbersOnly.length >= 9 && numbersOnly.length <= 15;
        
        // Verificar que solo contenga números después de limpiar
        const isNumeric = /^\d+$/.test(numbersOnly);
        
        return isValidLength && isNumeric;
    }

    /**
     * Formatea el número de teléfono para enviarlo a la API
     * @param {string} phoneNumber - Número de teléfono a formatear
     * @returns {string} - Número formateado
     */
    formatPhoneNumber(phoneNumber) {
        if (!phoneNumber) return '';
        
        let cleaned = phoneNumber.trim();
        
        // Si no empieza con +, asumimos que es un número peruano y agregamos +51
        if (!cleaned.startsWith('+')) {
            // Si empieza con 51, solo agregamos el +
            if (cleaned.startsWith('51')) {
                cleaned = '+' + cleaned;
            } else {
                // Si no empieza con 51, asumimos que es un número local peruano
                cleaned = '+51' + cleaned;
            }
        }
        
        return cleaned;
    }
}

// Exportar la clase para que esté disponible en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PasswordRecoveryService;
} else {
    // Para navegadores sin soporte de módulos
    window.PasswordRecoveryService = PasswordRecoveryService;
}
