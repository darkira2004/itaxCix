class LoginController {
    constructor() {
        this.form = document.getElementById('login-form');
        this.errorMsg = document.getElementById('error-msg');
        this.submitBtn = this.form.querySelector('.btn-ingresar');
        this.btnText = this.submitBtn.querySelector('.btn-text');
        this.btnLoading = this.submitBtn.querySelector('.btn-loading');
        this.loginService = window.LoginService;
        this.baseUrl = window.location.hostname.includes('github.io') 
            ? '/itaxCix'
            : '';
        this.init();
    }

    init() {
        // Prevenir comportamiento por defecto del formulario
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Configurar toggle de contraseña
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                togglePassword.classList.toggle('fa-eye');
                togglePassword.classList.toggle('fa-eye-slash');
            });
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