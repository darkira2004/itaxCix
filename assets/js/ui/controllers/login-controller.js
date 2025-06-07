class LoginController {
    constructor() {
        this.form = document.getElementById('login-form');
        this.errorMsg = document.getElementById('error-msg');
        this.submitBtn = this.form.querySelector('.btn-ingresar');
        this.btnText = this.submitBtn.querySelector('.btn-text');
        this.btnLoading = this.submitBtn.querySelector('.btn-loading');        this.loginService = window.LoginService;
        
          this.baseUrl = window.location.hostname.includes('github.io') 
            ? '/itaxCix'
            : '';
        this.init();
    }    init() {
        // Prevenir comportamiento por defecto del formulario
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });        // Configurar toggle de contraseña
        this.setupPasswordToggle();
        
        // Configurar validación del documento
        this.setupDocumentValidation();
    }    /**
     * Configura la funcionalidad para mostrar/ocultar contraseña
     */
    setupPasswordToggle() {
        const passwordInput = document.getElementById('password');
        const eyeIcon = document.getElementById('eye-icon');
        
        if (passwordInput && eyeIcon) {
            eyeIcon.addEventListener('click', (e) => {
                e.preventDefault(); // Prevenir cualquier comportamiento por defecto
                
                const isPassword = passwordInput.getAttribute('type') === 'password';
                
                // Toggle tipo de input
                passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
                
                // Toggle icono
                eyeIcon.classList.toggle('fa-eye', !isPassword);
                eyeIcon.classList.toggle('fa-eye-slash', isPassword);
                
                // Cambiar título del ícono para accesibilidad
                eyeIcon.setAttribute('title', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
            });
            
            // Establecer título inicial
            eyeIcon.setAttribute('title', 'Mostrar contraseña');
        }    }

    setLoading(isLoading) {
        this.submitBtn.disabled = isLoading;
        this.btnText.style.display = isLoading ? 'none' : 'inline';
        this.btnLoading.style.display = isLoading ? 'inline' : 'none';
    }    async handleLogin() {
        const documentInput = document.getElementById('documentValue');
        const passwordInput = document.getElementById('password');
        if (!documentInput || !passwordInput) {
            this.showError("Error interno: formulario no disponible.");
            return;
        }
        const documentValue = documentInput.value.trim();
        const password = passwordInput.value;

        // Validar que el documento tenga exactamente 8 dígitos numéricos
        if (!documentValue) {
            this.showError("Por favor, ingresa tu número de documento.");
            return;
        }
        
        if (!/^[0-9]{8}$/.test(documentValue)) {
            this.showError("El documento debe contener exactamente 8 dígitos numéricos.");
            return;
        }

        try {
            this.setLoading(true);
            const response = await this.loginService.verifyCredentials(documentValue, password);

            // Soporta tanto mock (objeto plano) como API real ({success, data})
            const data = response && response.data ? response.data : response;

            if (data && data.token) {
                sessionStorage.clear();
                sessionStorage.setItem("isLoggedIn", "true");
                sessionStorage.setItem("authToken", data.token);
                sessionStorage.setItem("userId", data.userId.toString());
                sessionStorage.setItem("documentValue", data.documentValue);
                sessionStorage.setItem("userRoles", JSON.stringify(data.roles));
                sessionStorage.setItem("userPermissions", JSON.stringify(data.permissions));
                sessionStorage.setItem("userAvailability", data.availability?.toString() ?? "true");
                sessionStorage.setItem("loginTime", Date.now().toString());

                window.history.pushState(null, '', window.location.href);
                window.location.replace(`${this.baseUrl}/pages/usuarios/ControlAdmisionConductores.html`);
            } else {
                this.showError((response && response.message) || "Error de autenticación");
            }
        } catch (error) {
            console.error('Error durante el login:', error);
            this.showError("Error en el servidor");
        } finally {
            this.setLoading(false);
        }
    }

    showError(message) {
        this.errorMsg.textContent = message;
        this.errorMsg.style.display = 'block';
        setTimeout(() => {
            this.errorMsg.style.display = 'none';
        }, 3000);
   }

    /**
     * Configura la validación del campo de documento
     * Solo permite 8 dígitos numéricos
     */
    setupDocumentValidation() {
        const documentInput = document.getElementById('documentValue');
        
        if (documentInput) {
            // Evento para filtrar solo números y limitar a 8 dígitos
            documentInput.addEventListener('input', (e) => {
                // Remover cualquier carácter que no sea número
                let value = e.target.value.replace(/[^0-9]/g, '');
                
                // Limitar a máximo 8 dígitos
                if (value.length > 8) {
                    value = value.slice(0, 8);
                }
                
                // Actualizar el valor del input
                e.target.value = value;
            });
            
            // Prevenir pegar texto que no sean números
            documentInput.addEventListener('paste', (e) => {
                e.preventDefault();
                
                // Obtener texto del clipboard
                const paste = (e.clipboardData || window.clipboardData).getData('text');
                
                // Filtrar solo números y limitar a 8 dígitos
                const filteredPaste = paste.replace(/[^0-9]/g, '').slice(0, 8);
                
                // Establecer el valor filtrado
                documentInput.value = filteredPaste;
            });
            
            // Prevenir entrada de teclas no numéricas (excepto teclas de control)
            documentInput.addEventListener('keypress', (e) => {
                // Permitir teclas de control (backspace, delete, tab, etc.)
                if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab' || 
                    e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') {
                    return;
                }
                
                // Permitir solo números (0-9)
                if (!/^[0-9]$/.test(e.key)) {
                    e.preventDefault();
                }
                
                // Prevenir entrada si ya tiene 8 dígitos
                if (documentInput.value.length >= 8) {
                    e.preventDefault();
                }
            });
        }
    }
}

// Inicializar el controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new LoginController();
});