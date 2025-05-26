class SidebarController {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.closeButton = document.getElementById('close-sidebar');
        this.submenuParent = document.querySelector('.sidebar-menu .has-submenu > a');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSubmenuHandlers();
    }

    setupEventListeners() {
        // Manejador para cerrar/abrir sidebar
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.sidebar.classList.toggle('collapsed');
            });
        }

        // Cerrar sidebar al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!this.sidebar.contains(e.target) && 
                !e.target.matches('.sidebar-toggle') && 
                window.innerWidth <= 768) {
                this.sidebar.classList.add('collapsed');
            }
        });
    }

    setupSubmenuHandlers() {
        // Manejador para submenús
        if (this.submenuParent) {
            this.submenuParent.addEventListener('click', (e) => {
                e.preventDefault();
                const parentLi = this.submenuParent.parentElement;
                
                // Cerrar otros submenús abiertos
                const otherOpenMenus = document.querySelectorAll('.sidebar-menu .has-submenu.open');
                otherOpenMenus.forEach(menu => {
                    if (menu !== parentLi) {
                        menu.classList.remove('open');
                    }
                });

                // Toggle del submenú actual
                parentLi.classList.toggle('open');
            });
        }
    }
}

// Inicializar el controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new SidebarController();
});