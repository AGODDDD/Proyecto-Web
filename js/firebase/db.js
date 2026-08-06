/**
 * =========================================================
 * FIREBASE DATABASE CONTROLLER (db.js)
 * =========================================================
 * Este módulo contiene todas las funciones que se comunican 
 * con la base de datos Firestore (Leer y Escribir).
 */
import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./config.js";
import { cargarEstadisticasDeporte } from "../stats/live.js";

/**
 * Guarda un nuevo registro (equipo y sus jugadores) en Firebase.
 * @param {Object} datos - El objeto con toda la información del formulario.
 */
export async function guardarRegistro(datos) {
    // Añadimos la fecha exacta del servidor para saber cuándo se registró
    datos.fechaRegistro = serverTimestamp();
    // Insertamos el documento en la colección "inscripciones"
    const docRef = await addDoc(collection(db, "inscripciones"), datos);
    console.log("Documento escrito en Firestore con ID: ", docRef.id);
}

/**
 * Lee en tiempo real (En Vivo) los equipos inscritos de un deporte específico.
 * Se ejecuta automáticamente al cargar las páginas de fútbol, básquet, etc.
 * @param {string} deporte - El nombre del deporte a consultar ("futbol", "basquet", etc.)
 */
export function cargarInscritosPorDeporte(deporte) {
    const cuerpoTabla = document.getElementById("tabla-inscritos-firebase");
    if (!cuerpoTabla) return; 

    try {
        // Armamos la consulta: Buscar solo los documentos de ESTE deporte
        const consulta = query(collection(db, "inscripciones"), where("deporte", "==", deporte));

        // onSnapshot "escucha" la base de datos permanentemente. Si alguien agrega un equipo, esto se ejecuta de nuevo al instante.
        onSnapshot(consulta, (snapshot) => {
            cuerpoTabla.innerHTML = ""; // Limpiamos la tabla antes de reescribirla

            if (snapshot.empty) {
                cuerpoTabla.innerHTML = "<tr><td colspan='4'>Aún no hay inscritos en este deporte.</td></tr>";
            } else {
                // Recorremos cada equipo encontrado
                snapshot.forEach((doc) => {
                    const datos = doc.data();
                    const fila = document.createElement("tr");

                    // Dibujamos la fila HTML
                    fila.innerHTML = `
                        <td>${datos.equipo}</td>
                        <td>${datos.institucion}</td>
                        <td>${datos.categoria}</td>
                        <td>${datos.delegado}</td>
                    `;
                    cuerpoTabla.appendChild(fila);
                });
                
                // Llama al motor de estadísticas en vivo enviándole los datos frescos
                cargarEstadisticasDeporte(deporte, snapshot);
            }

            // Actualizamos la barra de búsqueda (por si el usuario estaba buscando algo mientras entró un dato nuevo)
            const buscador = cuerpoTabla.closest(".table-responsive")?.querySelector(".search-input");
            if (buscador) {
                buscador.dispatchEvent(new Event("input"));
            }

        }, (error) => {
            console.error("Error al cargar datos en tiempo real:", error);
            cuerpoTabla.innerHTML = "<tr><td colspan='4'>Error al conectarse a Firebase.</td></tr>";
        });
    } catch (error) {
        console.error("Error general:", error);
    }
}

/**
 * Lee todos los registros para armar el bloque resumen de la página de inicio.
 * @param {Function} callback - Función que se ejecuta cada vez que cambian los números.
 */
export function escucharResumenGeneral(callback) {
    const consulta = collection(db, "inscripciones");
    
    // Escucha toda la colección en tiempo real
    onSnapshot(consulta, (snapshot) => {
        let totalEquipos = snapshot.size;
        let totalParticipantes = 0;
        let disciplinasSet = new Set(); // Evita contar deportes duplicados

        snapshot.forEach(doc => {
            const data = doc.data();
            disciplinasSet.add(data.deporte); // Añadimos el deporte a la lista única
            if (data.jugadores) {
                totalParticipantes += data.jugadores.length; // Sumamos cuántos jugadores trajo este equipo
            }
        });

        // Le devolvemos los cálculos terminados a la interfaz
        callback({
            disciplinas: disciplinasSet.size,
            equipos: totalEquipos,
            participantes: totalParticipantes
        });
    });
}
