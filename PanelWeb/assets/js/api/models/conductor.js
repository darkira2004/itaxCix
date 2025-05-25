// Definición de la clase Conductor
class Conductor {
    constructor(id, nombre, apellido, dni, placa, contacto, imagen, estado = 'pendiente') {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.placa = placa;
        this.contacto = contacto;
        this.imagen = imagen;
        this.estado = estado; // pendiente, aprobado, rechazado
    }

    // Método para obtener el nombre completo
    getNombreCompleto() {
        return `${this.nombre} ${this.apellido}`;
    }

    // Método para cambiar el estado
    cambiarEstado(nuevoEstado) {
        if (['pendiente', 'aprobado', 'rechazado'].includes(nuevoEstado)) {
            this.estado = nuevoEstado;
            return true;
        }
        return false;
    }
}

// Exportar la clase para que esté disponible en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Conductor;
} else {
    // Para navegadores sin soporte de módulos
    window.Conductor = Conductor;
}