// Este comentario indica que aquí se importarían las clases necesarias si estuviéramos usando un sistema de módulos
// En este caso, está comentado porque estamos usando carga de scripts directa en el HTML
// const ConductorService = require('../../api/services/conductor-service');

// Clase principal que controla toda la interfaz de usuario del panel de administración
class UIController {
    constructor() {
        // Creamos una instancia del servicio de conductores que manejará los datos y la comunicación con la API
        this.conductorService = new ConductorService();
        
        // Variable para almacenar el ID del conductor que se está visualizando actualmente en el modal
        this.currentConductorId = null;
        
        // Obtenemos referencias a todos los elementos del DOM que necesitaremos manipular
        // Cada propiedad corresponde a un elemento en el HTML con el mismo ID o clase
        
        // Referencia al tbody de la tabla donde se mostrarán los conductores (<tbody id="drivers-list">)
        this.driversList = document.getElementById('drivers-list');
        
        // Referencia al indicador de carga (<div id="loading-indicator">)
        this.loadingIndicator = document.getElementById('loading-indicator');
        
        // Referencia al modal de detalles del conductor (<div id="driver-modal">)
        this.modal = document.getElementById('driver-modal');
        
        // Referencia al botón para cerrar el modal (<span class="close-modal">)
        this.closeModal = document.querySelector('.close-modal');
        
        // Referencia al toast para notificaciones (<div id="toast">)
        this.toast = document.getElementById('toast');
        
        // Referencia al mensaje dentro del toast (<div id="toast-message">)
        this.toastMessage = document.getElementById('toast-message');
        
        // Referencias a los elementos dentro del modal para mostrar los detalles del conductor
        this.modalName = document.getElementById('modal-name');         // <h3 id="modal-name">
        this.modalDni = document.getElementById('modal-dni');           // <span id="modal-dni">
        this.modalPlaca = document.getElementById('modal-placa');       // <span id="modal-placa">
        this.modalContacto = document.getElementById('modal-contacto'); // <span id="modal-contacto">
        this.modalEstado = document.getElementById('modal-estado');     // <span id="modal-estado">
        this.modalAvatar = document.getElementById('modal-avatar');     // <img id="modal-avatar">
        
        // Referencias a los botones de acción dentro del modal
        this.modalAccept = document.getElementById('modal-accept');     // <button id="modal-accept">
        this.modalReject = document.getElementById('modal-reject');     // <button id="modal-reject">
        
        // Referencias a elementos del sidebar
        this.sidebar = document.getElementById('sidebar');              // <div id="sidebar">
        this.openSidebarBtn = document.getElementById('open-sidebar');  // <button id="open-sidebar">
        this.closeSidebarBtn = document.getElementById('close-sidebar');// <button id="close-sidebar">
        
        // Referencia al contenido principal para ajustar su margen cuando el sidebar está abierto
        this.mainContent = document.querySelector('.main-content');     // <div class="main-content">
    }

    // Método principal que inicializa la aplicación
    // Es async porque realiza operaciones asíncronas (como cargar datos de la API)
    async init() {
        try {
            // Muestra el indicador de carga mientras se inicializa la aplicación
            this.showLoading(true);
            
            // Llama al método del servicio para cargar los conductores desde la API
            // await espera a que esta operación asíncrona termine antes de continuar
            await this.conductorService.cargarConductoresDesdeAPI();
            
            // Una vez cargados los datos, renderiza los conductores en la tabla
            this.renderizarConductores();
            
            // Configura los event listeners para los botones y otros elementos interactivos
            this.initializeEvents();
            
            // Oculta el indicador de carga una vez que todo está listo
            this.showLoading(false);
        } catch (error) {
            // Si ocurre algún error durante la inicialización, lo manejamos aquí
            console.error('Error al inicializar la aplicación:', error);
            
            // Muestra un mensaje de error al usuario mediante un toast
            this.showToast('Error al cargar los datos de conductores');
            
            // Oculta el indicador de carga
            this.showLoading(false);
            
            // Muestra un mensaje de error en la tabla
            // Usa innerHTML para insertar HTML directamente en el elemento driversList
            // El mensaje ocupa 5 columnas (colspan="5") y tiene un icono de error
            this.driversList.innerHTML = `
                <tr>
                    <td colspan="5" class="no-data">
                        <i class="fas fa-exclamation-circle"></i>
                        Error al cargar los datos. Intente nuevamente.
                    </td>
                </tr>
            `;
        }
    }

    // Método para mostrar u ocultar el indicador de carga
    showLoading(show) {
        // Verifica que el elemento loadingIndicator exista antes de manipularlo
        if (this.loadingIndicator) {
            // Cambia la propiedad display del elemento según el parámetro show
            // Si show es true, muestra el indicador (display: flex)
            // Si show es false, oculta el indicador (display: none)
            this.loadingIndicator.style.display = show ? 'flex' : 'none';
        }
    }

    // Método para renderizar los conductores en la tabla
    renderizarConductores() {
        // Obtiene solo los conductores con estado "pendiente" del servicio
        const conductoresPendientes = this.conductorService.obtenerPorEstado('pendiente');
        
        // Limpia el contenido actual de la tabla
        this.driversList.innerHTML = '';
        
        // Si no hay conductores pendientes, muestra un mensaje indicándolo
        if (conductoresPendientes.length === 0) {
            this.driversList.innerHTML = `
                <tr>
                    <td colspan="5" class="no-data">
                        No hay conductores pendientes de aprobación
                    </td>
                </tr>
            `;
            return; // Sale del método para no continuar con el resto
        }
        
        // Si hay conductores pendientes, renderiza cada uno en la tabla
        // forEach itera sobre cada conductor en el array y llama a renderConductor
        conductoresPendientes.forEach(conductor => {
            this.renderConductor(conductor);
        });
    }

    // Método para renderizar un conductor individual en la tabla
    renderConductor(conductor) {
        // Crea un nuevo elemento tr (fila de tabla)
        const row = document.createElement('tr');
        
        // Asigna la clase 'driver-row' para aplicar estilos CSS
        row.className = 'driver-row';
        
        // Guarda el ID del conductor como un atributo data-* para referencia futura
        row.dataset.id = conductor.id;
        
        // Define el contenido HTML de la fila
        // Incluye:
        // 1. Celda con avatar y nombre completo
        // 2. Celda con DNI
        // 3. Celda con placa
        // 4. Celda con contacto
        // 5. Celda con botones de acción (detalles, aceptar, rechazar)
        row.innerHTML = `
            <td class="driver-name">
                <div class="avatar">
                    <img src="${conductor.imagen}" alt="Foto de perfil" onerror="this.onerror=null; this.src='https://via.placeholder.com/40?text=Sin+Imagen';">
                </div>
                <span>${conductor.getNombreCompleto()}</span>
            </td>
            <td>${conductor.dni}</td>
            <td>${conductor.placa}</td>
            <td>${conductor.contacto}</td>
            <td class="actions">
                <button class="btn btn-details" data-id="${conductor.id}">Detalles</button>
                <button class="btn btn-accept" data-id="${conductor.id}">Aceptar</button>
                <button class="btn btn-reject" data-id="${conductor.id}">Rechazar</button>
            </td>
        `;
        
        // Añade la fila creada al tbody de la tabla
        this.driversList.appendChild(row);
    }

    // Método para inicializar todos los event listeners
    initializeEvents() {
        // BOTONES DE DETALLES
        // Selecciona todos los botones con clase 'btn-details'
        // Para cada botón, añade un event listener para el evento 'click'
        document.querySelectorAll('.btn-details').forEach(button => {
            button.addEventListener('click', (e) => {
                // Obtiene el ID del conductor desde el atributo data-id del botón
                const id = parseInt(e.target.dataset.id);
                
                // Busca el conductor con ese ID en el servicio
                const conductor = this.conductorService.obtenerPorId(id);
                
                // Si encuentra el conductor, muestra sus detalles en el modal
                if (conductor) {
                    this.showDriverDetails(conductor);
                }
            });
        });

        // BOTONES DE ACEPTAR
        // Similar al anterior, pero para los botones de aceptar
        document.querySelectorAll('.btn-accept').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                // Llama al método para aceptar el conductor
                this.acceptDriver(id);
            });
        });

        // BOTONES DE RECHAZAR
        // Similar al anterior, pero para los botones de rechazar
        document.querySelectorAll('.btn-reject').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                // Llama al método para rechazar el conductor
                this.rejectDriver(id);
            });
        });

        // CERRAR MODAL
        // Añade un event listener al botón de cerrar el modal
        this.closeModal.addEventListener('click', () => {
            // Oculta el modal cambiando su propiedad display a 'none'
            this.modal.style.display = 'none';
        });

        // CERRAR MODAL AL HACER CLIC FUERA
        // Añade un event listener al objeto window para detectar clics en cualquier parte
        window.addEventListener('click', (event) => {
            // Si el clic fue directamente en el modal (no en su contenido)
            if (event.target === this.modal) {
                // Oculta el modal
                this.modal.style.display = 'none';
            }
        });

        // BOTONES DEL MODAL
        // Botón de aceptar dentro del modal
        this.modalAccept.addEventListener('click', () => {
            // Si hay un ID de conductor actual
            if (this.currentConductorId) {
                // Acepta el conductor
                this.acceptDriver(this.currentConductorId);
                // Cierra el modal
                this.modal.style.display = 'none';
            }
        });

        // Botón de rechazar dentro del modal
        this.modalReject.addEventListener('click', () => {
            // Si hay un ID de conductor actual
            if (this.currentConductorId) {
                // Rechaza el conductor
                this.rejectDriver(this.currentConductorId);
                // Cierra el modal
                this.modal.style.display = 'none';
            }
        });

        // SIDEBAR TOGGLE
        // Botón para abrir el sidebar
        this.openSidebarBtn.addEventListener('click', () => this.toggleSidebar());
        // Botón para cerrar el sidebar
        this.closeSidebarBtn.addEventListener('click', () => this.toggleSidebar());
    }

    // Método para mostrar los detalles de un conductor en el modal
    showDriverDetails(conductor) {
        // Guarda el ID del conductor actual para usarlo en los botones del modal
        this.currentConductorId = conductor.id;
        
        // Actualiza el contenido de los elementos del modal con los datos del conductor
        this.modalName.textContent = conductor.getNombreCompleto();  // Nombre completo
        this.modalDni.textContent = conductor.dni;                   // DNI
        this.modalPlaca.textContent = conductor.placa;               // Placa
        this.modalContacto.textContent = conductor.contacto;         // Contacto
        this.modalEstado.textContent = this.formatEstado(conductor.estado); // Estado formateado
        
        // Actualiza la imagen del avatar
        this.modalAvatar.src = conductor.imagen;
        
        // Configura un manejador de error para la imagen
        // Si la imagen no se puede cargar, muestra una imagen de placeholder
        this.modalAvatar.onerror = function() {
            this.onerror = null; // Evita bucles infinitos
            this.src = 'https://via.placeholder.com/100?text=Sin+Imagen';
        };
        
        // Muestra el modal cambiando su propiedad display a 'block'
        this.modal.style.display = 'block';
    }

    // Método para formatear el estado del conductor para mostrar
    formatEstado(estado) {
        // Objeto que mapea los valores internos de estado a textos para mostrar
        const estados = {
            'pendiente': 'Pendiente',
            'aprobado': 'Aprobado',
            'rechazado': 'Rechazado'
        };
        
        // Devuelve el texto formateado o el estado original si no está en el mapeo
        return estados[estado] || estado;
    }

    // Método para aceptar un conductor
    // Es async porque realiza operaciones asíncronas (llamadas a la API)
    async acceptDriver(id) {
        try {
            // Muestra el indicador de carga
            this.showLoading(true);
            
            // Llama al método del servicio para aprobar el conductor
            // await espera a que esta operación asíncrona termine antes de continuar
            const success = await this.conductorService.aprobarConductor(id);
            
            // Oculta el indicador de carga
            this.showLoading(false);
            
            // Si la operación fue exitosa
            if (success) {
                // Busca la fila del conductor en la tabla usando un selector CSS
                // La fila tiene un atributo data-id que coincide con el ID del conductor
                const row = document.querySelector(`.driver-row[data-id="${id}"]`);
                
                // Si encuentra la fila, la oculta
                if (row) {
                    row.style.display = 'none';
                }
                
                // Muestra una notificación de éxito
                this.showToast('Conductor aprobado exitosamente');
                
                // Verifica si quedan conductores pendientes en la tabla
                this.checkEmptyTable();
            } else {
                // Si la operación falló, muestra una notificación de error
                this.showToast('Error al aprobar conductor');
            }
        } catch (error) {
            // Si ocurre una excepción, la maneja aquí
            console.error('Error al aprobar conductor:', error);
            this.showToast('Error al aprobar conductor');
            this.showLoading(false);
        }
    }

    // Método para rechazar un conductor
    // Es async porque realiza operaciones asíncronas (llamadas a la API)
    async rejectDriver(id) {
        try {
            // Muestra el indicador de carga
            this.showLoading(true);
            
            // Llama al método del servicio para rechazar el conductor
            // await espera a que esta operación asíncrona termine antes de continuar
            const success = await this.conductorService.rechazarConductor(id);
            
            // Oculta el indicador de carga
            this.showLoading(false);
            
            // Si la operación fue exitosa
            if (success) {
                // Busca la fila del conductor en la tabla usando un selector CSS
                // La fila tiene un atributo data-id que coincide con el ID del conductor
                const row = document.querySelector(`.driver-row[data-id="${id}"]`);
                
                // Si encuentra la fila, la oculta
                if (row) {
                    row.style.display = 'none';
                }
                
                // Muestra una notificación de éxito
                this.showToast('Conductor rechazado');
                
                // Verifica si quedan conductores pendientes en la tabla
                this.checkEmptyTable();
            } else {
                // Si la operación falló, muestra una notificación de error
                this.showToast('Error al rechazar conductor');
            }
        } catch (error) {
            // Si ocurre una excepción, la maneja aquí
            console.error('Error al rechazar conductor:', error);
            this.showToast('Error al rechazar conductor');
            this.showLoading(false);
        }
    }

    // Método para verificar si la tabla está vacía y mostrar un mensaje
    checkEmptyTable() {
        // Obtiene todas las filas de conductores y filtra solo las visibles
        // Array.from convierte la NodeList a un array para poder usar filter
        const visibleRows = Array.from(document.querySelectorAll('.driver-row')).filter(row => 
            row.style.display !== 'none'
        );
        
        // Si no hay filas visibles, muestra un mensaje de "no hay conductores pendientes"
        if (visibleRows.length === 0) {
            this.driversList.innerHTML = `
                <tr>
                    <td colspan="5" class="no-data">
                        No hay conductores pendientes de aprobación
                    </td>
                </tr>
            `;
        }
    }

    // Método para mostrar una notificación toast
    showToast(message) {
        // Actualiza el texto del mensaje
        this.toastMessage.textContent = message;
        
        // Muestra el toast cambiando su propiedad display a 'block'
        this.toast.style.display = 'block';
        
        // Configura un temporizador para ocultar el toast después de 3 segundos
        setTimeout(() => {
            this.toast.style.display = 'none';
        }, 3000);
    }

    // Método para alternar la visibilidad del sidebar
    toggleSidebar() {
        // Alterna la clase 'active' en el sidebar
        // Si tiene la clase, la quita; si no la tiene, la añade
        this.sidebar.classList.toggle('active');
        
        // En pantallas grandes (más de 992px de ancho)
        // También ajusta el margen del contenido principal
        if (window.innerWidth > 992) {
            this.mainContent.classList.toggle('sidebar-active');
        }
    }
}

// Exportar la clase para que esté disponible en otros archivos
// Si estamos en un entorno Node.js (module está definido)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIController;
} else {
    // Si estamos en un navegador, añade la clase al objeto global window
    window.UIController = UIController;
}
// Verificar y mostrar datos de autenticación en la consola
console.log("=== DATOS DE AUTENTICACIÓN ===");
console.log("isLoggedIn:", sessionStorage.getItem("isLoggedIn"));
console.log("Token:", sessionStorage.getItem("authToken"));
console.log("userId:", sessionStorage.getItem("userId"));
console.log("documentValue:", sessionStorage.getItem("documentValue"));
console.log("Roles:", sessionStorage.getItem("userRoles"));
console.log("Permisos:", sessionStorage.getItem("userPermissions"));
console.log("Disponibilidad:", sessionStorage.getItem("userAvailability"));
console.log("============================");