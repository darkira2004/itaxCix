class AppInitializer {
    static init() {
        if (authChecker.checkAuthentication()) {
            authChecker.updateUserDisplay();
            authChecker.setupLogoutButton();
            
            // Inicializar controladores
            new SidebarController();
            const app = new UIController();
            app.init();
            
            // Configurar verificación de sesión
            setInterval(authChecker.checkTokenExpiration, 60000);
        }
    }
}

document.addEventListener('DOMContentLoaded', AppInitializer.init);