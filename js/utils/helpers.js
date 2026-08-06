/**
 * =========================================================
 * FUNCIONES DE AYUDA / UTILERÍA (helpers.js)
 * =========================================================
 * Pequeñas funciones que se usan en muchos otros archivos 
 * para no repetir código.
 */

/**
 * Averigua el nombre del archivo HTML en el que estamos (ej. "futbol.html")
 */
export function obtenerPaginaActual() {
    const ruta = window.location.pathname.split("/").pop();
    return ruta === "" ? "index.html" : ruta;
}

/**
 * Convierte el código interno del deporte en un nombre bonito para mostrar al usuario.
 */
export function convertirNombreDeporte(valor) {
    switch (valor) {
        case "futbol":
            return "Fútbol varones";
        case "basquet":
            return "Básquet varones";
        case "voley":
            return "Vóley damas";
        case "pingpong":
            return "Ping pong mixto";
        default:
            return "No definido";
    }
}

/**
 * Pinta un mensaje en pantalla (rojo, verde o amarillo dependiendo del tipo).
 */
export function mostrarMensaje(panel, mensaje, tipo) {
    panel.textContent = mensaje;
    panel.className = `form-message ${tipo}`; // .success, .warning o .info
}

/**
 * Atajo rápido para no escribir document.getElementById().value.trim() a cada rato.
 */
export function obtenerValor(id) {
    const elemento = document.getElementById(id);
    return elemento ? elemento.value.trim() : "";
}
