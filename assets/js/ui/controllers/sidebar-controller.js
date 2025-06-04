class SidebarController {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.closeButton = document.getElementById('close-sidebar');
        this.logoutButton = document.querySelector('.logout-btn');
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Manejador para cerrar/abrir sidebar
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.sidebar.classList.toggle('collapsed');
            });
        }
        // Manejador del submenu
        const tablasLink = document.querySelector('.module-tablas');
        if (tablasLink) {
            tablasLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // <-- Añade esto
                const submenuParent = tablasLink.closest('.has-submenu');
                if (submenuParent) {
                    submenuParent.classList.toggle('open');
                }
            }, { once: false }); // Asegura que no se registre solo una vez
        }

        // Evento para cerrar sesión
        if (this.logoutButton) {
            this.logoutButton.addEventListener('click', function(e) {
                e.preventDefault();
                routeGuard.logout();
            });
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (!window.sidebarControllerInstance) { // Evita doble inicialización
        window.sidebarControllerInstance = new SidebarController();
    }
});