// Servicio mock para simular la recuperación de contraseñas en desarrollo local
class MockPasswordRecoveryService {
    constructor() {
        console.log('MockPasswordRecoveryService inicializado (modo desarrollo)');
        
        // Base de datos simulada de usuarios
        this.mockUsers = [
            { 
                id: 1, 
                email: 'admin@itaxcix.com', 
                phone: '+51987654321',
                documentValue: '12345678'
            },
            { 
                id: 2, 
                email: 'conductor@itaxcix.com', 
                phone: '+51912345678',
                documentValue: '87654321'
            },
            { 
                id: 3, 
                email: 'test@example.com', 
                phone: '+51999888777',
                documentValue: '11223344'
            }
        ];
        
        // Códigos de verificación simulados (en producción esto estaría en el servidor)
        this.verificationCodes = new Map();
    }

    /**
     * Simula el envío de un código de recuperación de contraseña
     * @param {string} contactValue - Correo electrónico o número de teléfono del usuario
     * @param {string} contactType - Tipo de contacto ('email' o 'phone')
     * @returns {Promise<Object>} - Respuesta simulada de la API
     */
    async requestPasswordReset(contactValue, contactType = 'phone') {
        try {
            console.log(`[MOCK] Solicitando recuperación de contraseña para ${contactType}: ${contactValue}`);
            
            // Simular delay de red
            await this.simulateNetworkDelay();
            
            let formattedContactValue;
            if (contactType === 'phone') {
                formattedContactValue = this.formatPhoneNumber(contactValue.trim());
            } else {
                formattedContactValue = contactValue.trim().toLowerCase();
            }

            // Buscar usuario por email o teléfono
            const user = this.findUserByContact(formattedContactValue, contactType);
            
            if (!user) {
                return {
                    success: false,
                    message: contactType === 'email' 
                        ? 'No se encontró una cuenta asociada a este correo electrónico.'
                        : 'No se encontró una cuenta asociada a este número de teléfono.'
                };
            }

            // Generar código de verificación mock
            const verificationCode = this.generateMockCode();
            
            // Guardar código en el "almacén" temporal
            this.verificationCodes.set(user.id, {
                code: verificationCode,
                contactValue: formattedContactValue,
                contactType: contactType,
                expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutos
                attempts: 0
            });

            console.log(`[MOCK] Código generado para usuario ${user.id}: ${verificationCode}`);
            
            // Simular respuesta exitosa
            return {
                success: true,
                message: contactType === 'email' 
                    ? `Se ha enviado un código de verificación a ${this.maskEmail(formattedContactValue)}`
                    : `Se ha enviado un código de verificación a ${this.maskPhone(formattedContactValue)}`,
                userId: user.id
            };

        } catch (error) {
            console.error('[MOCK] Error al solicitar recuperación de contraseña:', error);
            return {
                success: false,
                message: 'Error interno del servidor. Inténtalo más tarde.'
            };
        }
    }

    /**
     * Simula la verificación de un código de recuperación
     * @param {number} userId - ID del usuario
     * @param {string} code - Código de verificación ingresado
     * @returns {Promise<Object>} - Respuesta simulada de la API
     */
    async verifyRecoveryCode(userId, code) {
        try {
            console.log(`[MOCK] Verificando código para usuario ${userId}: ${code}`);
            
            // Simular delay de red
            await this.simulateNetworkDelay();
            
            const storedData = this.verificationCodes.get(userId);
            
            if (!storedData) {
                return {
                    success: false,
                    message: 'Código expirado o inválido. Solicita uno nuevo.'
                };
            }

            // Verificar si el código ha expirado
            if (Date.now() > storedData.expiresAt) {
                this.verificationCodes.delete(userId);
                return {
                    success: false,
                    message: 'El código ha expirado. Solicita uno nuevo.'
                };
            }

            // Incrementar intentos
            storedData.attempts++;

            // Verificar número máximo de intentos
            if (storedData.attempts > 3) {
                this.verificationCodes.delete(userId);
                return {
                    success: false,
                    message: 'Demasiados intentos fallidos. Solicita un código nuevo.'
                };
            }

            // Verificar código
            if (storedData.code !== code.toUpperCase()) {
                return {
                    success: false,
                    message: `Código incorrecto. Te quedan ${4 - storedData.attempts} intentos.`
                };
            }

            // Código correcto - limpiar y generar token mock
            this.verificationCodes.delete(userId);
            const mockToken = this.generateMockToken(userId);
            
            console.log(`[MOCK] Código verificado exitosamente. Token: ${mockToken}`);
            
            return {
                success: true,
                message: 'Código verificado correctamente.',
                token: mockToken
            };

        } catch (error) {
            console.error('[MOCK] Error al verificar código:', error);
            return {
                success: false,
                message: 'Error interno del servidor. Inténtalo más tarde.'
            };
        }
    }

    /**
     * Encuentra un usuario por email o teléfono
     * @param {string} contactValue - Valor de contacto
     * @param {string} contactType - Tipo de contacto
     * @returns {Object|null} - Usuario encontrado o null
     */
    findUserByContact(contactValue, contactType) {
        return this.mockUsers.find(user => {
            if (contactType === 'email') {
                return user.email.toLowerCase() === contactValue.toLowerCase();
            } else {
                return user.phone === contactValue;
            }
        });
    }

    /**
     * Genera un código de verificación mock
     * @returns {string} - Código de verificación
     */
    generateMockCode() {
        // Códigos predefinidos para testing fácil
        const codes = ['ABC123', 'XYZ789', 'DEF456', 'GHI012', 'JKL345'];
        return codes[Math.floor(Math.random() * codes.length)];
    }

    /**
     * Genera un token mock para el proceso de cambio de contraseña
     * @param {number} userId - ID del usuario
     * @returns {string} - Token mock
     */
    generateMockToken(userId) {
        const timestamp = Date.now();
        return `mock_reset_token_${userId}_${timestamp}`;
    }

    /**
     * Simula delay de red para hacer más realista la experiencia
     * @param {number} ms - Milisegundos de delay (por defecto 1-3 segundos)
     */
    async simulateNetworkDelay(ms = null) {
        const delay = ms || (1000 + Math.random() * 2000); // 1-3 segundos
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    /**
     * Enmascara un email para mostrar solo parcialmente
     * @param {string} email - Email a enmascarar
     * @returns {string} - Email enmascarado
     */
    maskEmail(email) {
        const [username, domain] = email.split('@');
        if (username.length <= 2) {
            return `${username[0]}***@${domain}`;
        }
        return `${username.substring(0, 2)}***@${domain}`;
    }

    /**
     * Enmascara un teléfono para mostrar solo parcialmente
     * @param {string} phone - Teléfono a enmascarar
     * @returns {string} - Teléfono enmascarado
     */
    maskPhone(phone) {
        if (phone.length <= 4) {
            return `***${phone.slice(-2)}`;
        }
        return `***${phone.slice(-4)}`;
    }

    /**
     * Formatea un número de teléfono
     * @param {string} phone - Número de teléfono sin formato
     * @returns {string} - Número de teléfono formateado
     */
    formatPhoneNumber(phone) {
        // Remover todos los caracteres no numéricos excepto el +
        let cleaned = phone.replace(/[^\d+]/g, '');
        
        // Si no empieza con +, asumir que es un número peruano
        if (!cleaned.startsWith('+')) {
            // Si tiene 9 dígitos, agregar código de país +51
            if (cleaned.length === 9) {
                cleaned = '+51' + cleaned;
            }
        }
        
        return cleaned;
    }

    /**
     * Valida el formato de un email
     * @param {string} email - Email a validar
     * @returns {boolean} - True si es válido
     */
    validateEmailFormat(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Valida el formato de un teléfono
     * @param {string} phone - Teléfono a validar
     * @returns {boolean} - True si es válido
     */
    validatePhoneFormat(phone) {
        const phoneRegex = /^(\+?[\d\s\-\(\)]{9,15})$/;
        return phoneRegex.test(phone);
    }

    /**
     * Valida el formato de un código de verificación
     * @param {string} code - Código a validar
     * @returns {boolean} - True si es válido
     */
    validateCodeFormat(code) {
        const codeRegex = /^[A-Z0-9]{4,8}$/;
        return codeRegex.test(code.toUpperCase());
    }
}

// Exportar la clase
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MockPasswordRecoveryService;
} else {
    window.MockPasswordRecoveryService = MockPasswordRecoveryService;
}
