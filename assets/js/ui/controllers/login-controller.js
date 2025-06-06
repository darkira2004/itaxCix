class LoginController {
    constructor() {
        this.form = document.getElementById('login-form');
        this.errorMsg = document.getElementById('error-msg');
        this.submitBtn = this.form.querySelector('.btn-ingresar');
        this.btnText = this.submitBtn.querySelector('.btn-text');
        this.btnLoading = this.submitBtn.querySelector('.btn-loading');
        this.loginService = window.LoginService;
          // Elementos para recuperar contraseña
        this.forgotPasswordBtn = document.getElementById('forgot-password-btn');
        this.forgotPasswordModal = document.getElementById('forgot-password-modal');
        this.closeModalBtn = document.getElementById('close-modal');
        this.forgotPasswordForm = document.getElementById('forgot-password-form');
        this.recoveryContactInput = document.getElementById('recovery-contact');
        this.recoveryMessage = document.getElementById('recovery-message');
        this.recoveryService = new PasswordRecoveryService();
        
        // Elementos del selector de tipo de contacto
        this.contactTypeRadios = document.querySelectorAll('input[name="contactType"]');
          this.baseUrl = window.location.hostname.includes('github.io') 
            ? '/itaxCix'
            : '';
        this.init();
    }    init() {
        // Prevenir comportamiento por defecto del formulario
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Configurar toggle de contraseña
        this.setupPasswordToggle();

        // Configurar funcionalidad de recuperar contraseña
        this.setupPasswordRecovery();
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
        }
    }

    setupPasswordRecovery() {
        // Abrir modal al hacer clic en "¿Olvidaste tu contraseña?"
        if (this.forgotPasswordBtn) {
            this.forgotPasswordBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openRecoveryModal();
            });
        }

        // Cerrar modal
        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', () => {
                this.closeRecoveryModal();
            });
        }

        // Cerrar modal al hacer clic fuera de él
        if (this.forgotPasswordModal) {
            this.forgotPasswordModal.addEventListener('click', (e) => {
                if (e.target === this.forgotPasswordModal) {
                    this.closeRecoveryModal();
                }
            });
        }        // Manejar envío del formulario de recuperación
        if (this.forgotPasswordForm) {
            this.forgotPasswordForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handlePasswordRecovery();
            });
        }

        // Configurar cambio de tipo de contacto
        this.setupContactTypeSelector();
    }    setupContactTypeSelector() {
        this.contactTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateContactInput();
            });
        });
        
        // Configurar el input inicial
        this.updateContactInput();
    }

    updateContactInput() {
        const selectedType = document.querySelector('input[name="contactType"]:checked')?.value;
        
        if (selectedType === 'email') {
            this.recoveryContactInput.type = 'email';
            this.recoveryContactInput.placeholder = 'Correo electrónico';
            this.recoveryContactInput.value = '';
        } else if (selectedType === 'phone') {
            this.recoveryContactInput.type = 'tel';
            this.recoveryContactInput.placeholder = 'Número de teléfono';
            this.recoveryContactInput.value = '';
        }
    }

    openRecoveryModal() {
        if (this.forgotPasswordModal) {
            this.forgotPasswordModal.style.display = 'flex';
            this.recoveryContactInput.focus();
            this.clearRecoveryMessage();
            this.updateContactInput(); // Asegurar que el input esté configurado correctamente
        }
    }

    closeRecoveryModal() {
        if (this.forgotPasswordModal) {
            this.forgotPasswordModal.style.display = 'none';
            this.recoveryContactInput.value = '';
            this.clearRecoveryMessage();
            // Resetear a email por defecto
            document.querySelector('input[name="contactType"][value="email"]').checked = true;
            this.updateContactInput();
        }
    }    async handlePasswordRecovery() {
        const contactValue = this.recoveryContactInput.value.trim();
        const selectedType = document.querySelector('input[name="contactType"]:checked')?.value;
        
        // Validar campo vacío
        if (!contactValue) {
            const fieldName = selectedType === 'email' ? 'correo electrónico' : 'número de teléfono';
            this.showRecoveryMessage(`Por favor, ingresa tu ${fieldName}.`, 'error');
            return;
        }

        // Validación específica según el tipo
        if (selectedType === 'email') {
            if (!this.recoveryService.validateEmailFormat(contactValue)) {
                this.showRecoveryMessage('Por favor, ingresa un correo electrónico válido.', 'error');
                return;
            }
        } else if (selectedType === 'phone') {
            if (!this.recoveryService.validatePhoneFormat(contactValue)) {
                this.showRecoveryMessage('Por favor, ingresa un número de teléfono válido (9-15 dígitos).', 'error');
                return;
            }
        }

        try {
            this.setRecoveryLoading(true);
            this.clearRecoveryMessage();

            const result = await this.recoveryService.requestPasswordReset(contactValue, selectedType);

            if (result.success) {
                this.showRecoveryMessage(result.message, 'success');
                // Cerrar modal después de 3 segundos si fue exitoso
                setTimeout(() => {
                    this.closeRecoveryModal();
                }, 3000);
            } else {
                this.showRecoveryMessage(result.message, 'error');
            }

        } catch (error) {
            console.error('Error en recuperación de contraseña:', error);
            this.showRecoveryMessage('Error interno. Inténtalo más tarde.', 'error');
        } finally {
            this.setRecoveryLoading(false);
        }
    }

    setRecoveryLoading(isLoading) {
        const submitBtn = this.forgotPasswordForm.querySelector('.btn-recovery');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        submitBtn.disabled = isLoading;
        submitBtn.classList.toggle('loading', isLoading);
        btnText.style.display = isLoading ? 'none' : 'inline';
        btnLoading.style.display = isLoading ? 'inline' : 'none';
    }

    showRecoveryMessage(message, type) {
        if (this.recoveryMessage) {
            this.recoveryMessage.textContent = message;
            this.recoveryMessage.className = type;
            this.recoveryMessage.style.display = 'block';
        }
    }

    clearRecoveryMessage() {
        if (this.recoveryMessage) {
            this.recoveryMessage.style.display = 'none';
            this.recoveryMessage.textContent = '';
            this.recoveryMessage.className = '';
        }
    }

    setLoading(isLoading) {
        this.submitBtn.disabled = isLoading;
        this.btnText.style.display = isLoading ? 'none' : 'inline';
        this.btnLoading.style.display = isLoading ? 'inline' : 'none';
    }

    async handleLogin() {
        const documentInput = document.getElementById('documentValue');
        const passwordInput = document.getElementById('password');
        if (!documentInput || !passwordInput) {
            this.showError("Error interno: formulario no disponible.");
            return;
        }
        const documentValue = documentInput.value;
        const password = passwordInput.value;

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
}

// Inicializar el controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new LoginController();
});