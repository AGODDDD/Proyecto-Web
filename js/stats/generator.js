/**
 * =========================================================
 * GENERADOR DE ESTADÍSTICAS FALSAS (generator.js)
 * =========================================================
 * Este módulo se usa al momento del registro para crear 
 * números falsos iniciales para los jugadores.
 */

/**
 * Genera estadísticas aleatorias individuales según el deporte.
 * @param {string} deporte 
 * @returns {Object} Ej: { goles: 5, asistencias: 2 }
 */
export function generarEstadisticasAleatorias(deporte) {
    if (deporte === "futbol") {
        return { goles: Math.floor(Math.random() * 15), asistencias: Math.floor(Math.random() * 8) };
    } else if (deporte === "basquet") {
        return { puntos: Math.floor(Math.random() * 40), rebotes: Math.floor(Math.random() * 15), asistencias: Math.floor(Math.random() * 12) };
    } else if (deporte === "voley") {
        return { puntos: Math.floor(Math.random() * 30), bloqueos: Math.floor(Math.random() * 15) };
    } else if (deporte === "pingpong") {
        return { ganados: Math.floor(Math.random() * 12), sets: Math.floor(Math.random() * 25) };
    }
    return {};
}

/**
 * Genera estadísticas globales del equipo (partidos ganados, perdidos, etc).
 * @param {string} deporte 
 * @returns {Object} 
 */
export function generarEstadisticasEquipoAleatorias(deporte) {
    if (deporte === "basquet") {
        const pg = Math.floor(Math.random() * 10);
        return { pj: 10, pg: pg, pp: 10 - pg, puntosFavor: Math.floor(Math.random() * 100) + 50, puntosContra: Math.floor(Math.random() * 80) + 40, puntos: pg * 2 };
    } else if (deporte === "voley") {
        const pg = Math.floor(Math.random() * 10);
        return { pj: 10, pg: pg, pp: 10 - pg, puntos: pg * 3 };
    }
    return {};
}
