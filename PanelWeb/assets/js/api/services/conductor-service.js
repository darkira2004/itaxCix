// Servicio para gestionar conductores (conectándose a endpoints)
class ConductorService {
    constructor() {
        this.conductores = []; // Inicializamos con un array vacío
        this.apiUrl = 'https://randomuser.me/api/'; // API pública de usuarios aleatorios
    }

    // Método para cargar conductores desde la API
    async cargarConductoresDesdeAPI() {
        try {
            console.log("Cargando conductores desde API...");
            
            // Hacer petición a la API de Random User para obtener 10 usuarios
            const response = await fetch(`${this.apiUrl}?results=10&nat=es`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Datos recibidos de la API:", data);
            
            // Convertir cada objeto de datos en una instancia de Conductor
            this.conductores = data.results.map((user, index) => {
                // Generar una placa aleatoria
                const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                const placa = Array(5).fill().map(() => letras.charAt(Math.floor(Math.random() * letras.length))).join('');
                
                return new Conductor(
                    index + 1, // ID
                    user.name.first, // Nombre
                    user.name.last, // Apellido
                    user.id.value || `${Math.floor(Math.random() * 10000000)}`, // DNI (o número aleatorio si no hay)
                    placa, // Placa aleatoria
                    user.phone, // Teléfono como contacto
                    user.picture.medium, // Imagen
                    'pendiente' // Estado por defecto
                );
            });
            
            console.log("Conductores cargados:", this.conductores);
            return this.conductores;
        } catch (error) {
            console.error('Error al cargar conductores:', error);
            throw error;
        }
    }

    // Método para obtener todos los conductores
    obtenerTodos() {
        return this.conductores;
    }

    // Método para obtener conductores por estado
    obtenerPorEstado(estado) {
        return this.conductores.filter(conductor => conductor.estado === estado);
    }

    // Método para obtener un conductor por ID
    obtenerPorId(id) {
        return this.conductores.find(conductor => conductor.id === id);
    }

    // Método para aprobar un conductor (actualiza en la API)
    async aprobarConductor(id) {
        try {
            const conductor = this.obtenerPorId(id);
            if (!conductor) {
                throw new Error('Conductor no encontrado');
            }

            // Simulamos una petición a la API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Actualizar el estado localmente
            return conductor.cambiarEstado('aprobado');
        } catch (error) {
            console.error('Error al aprobar conductor:', error);
            throw error;
        }
    }

    // Método para rechazar un conductor (actualiza en la API)
    async rechazarConductor(id) {
        try {
            const conductor = this.obtenerPorId(id);
            if (!conductor) {
                throw new Error('Conductor no encontrado');
            }

            // Simulamos una petición a la API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Actualizar el estado localmente
            return conductor.cambiarEstado('rechazado');
        } catch (error) {
            console.error('Error al rechazar conductor:', error);
            throw error;
        }
    }

    // Método para agregar un nuevo conductor
    async agregarConductor(nombre, apellido, dni, placa, contacto, imagen) {
        try {
            // Simulamos una petición a la API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Crear un nuevo ID (el siguiente disponible)
            const id = this.conductores.length > 0 
                ? Math.max(...this.conductores.map(c => c.id)) + 1 
                : 1;
            
            // Crear una instancia de Conductor
            const nuevoConductor = new Conductor(
                id,
                nombre,
                apellido,
                dni,
                placa,
                contacto,
                imagen || 'https://via.placeholder.com/100',
                'pendiente'
            );
            
            // Añadir al array local
            this.conductores.push(nuevoConductor);
            
            return nuevoConductor;
        } catch (error) {
            console.error('Error al agregar conductor:', error);
            throw error;
        }
    }
}

// Exportar la clase para que esté disponible en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConductorService;
} else {
    // Para navegadores sin soporte de módulos
    window.ConductorService = ConductorService;
}