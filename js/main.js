/**
 * =========================================================
 * ARCHIVO PRINCIPAL (main.js)
 * =========================================================
 * Este es el punto de entrada de la aplicación.
 * Se encarga de importar todos los módulos especializados
 * y ejecutar las funciones necesarias cuando la página HTML carga.
 */
import { obtenerPaginaActual } from "./utils/helpers.js";
import { 
    marcarMenuActivo, 
    crearResumenDinamicoInicio, 
    activarBuscadoresDeTablas, 
    activarBotonSubir, 
    activarModalContacto 
} from "./ui/components.js";
import { activarFormularioRegistro } from "./form/registro.js";
import { cargarInscritosPorDeporte } from "./firebase/db.js";

// Evento que espera a que todo el HTML se haya cargado antes de ejecutar JavaScript
document.addEventListener("DOMContentLoaded", () => {
    // 1. Activar componentes visuales generales
    marcarMenuActivo();             // Resalta el botón del menú de la página actual
    crearResumenDinamicoInicio();   // Crea el bloque de 3 estadísticas en la página de inicio
    activarBuscadoresDeTablas();    // Activa la barra de búsqueda encima de todas las tablas
    activarFormularioRegistro();    // Añade la lógica de validación al formulario de registro
    activarBotonSubir();            // Activa el botón de la esquina para subir al inicio
    activarModalContacto();         // Activa la ventana emergente de contacto

    // 2. Ejecutar lógica específica dependiendo de en qué página nos encontramos
    const pagina = obtenerPaginaActual();
    
    // Si estamos en la página de algún deporte, descargamos sus inscritos desde Firebase
    if (pagina === "futbol.html") {
        cargarInscritosPorDeporte("futbol");
    } else if (pagina === "basquet.html") {
        cargarInscritosPorDeporte("basquet");
    } else if (pagina === "voley.html") {
        cargarInscritosPorDeporte("voley");
    } else if (pagina === "pingpong.html") {
        cargarInscritosPorDeporte("pingpong");
    }
});
