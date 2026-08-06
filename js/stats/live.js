/**
 * =========================================================
 * MOTOR EN VIVO (live.js)
 * =========================================================
 * Este módulo toma los datos de Firebase, ordena a los jugadores 
 * y los hace subir de estadísticas solos cada 10 segundos para dar un 
 * efecto de "Partidos en vivo".
 */
import { generarEstadisticasAleatorias, generarEstadisticasEquipoAleatorias } from "./generator.js";

// Variable de control para no iniciar dos simuladores al mismo tiempo
let simuladorActivo = false;

/**
 * Función principal que recibe la base de datos, desglosa los jugadores 
 * en una gran lista y manda a pintar las tablas.
 * @param {string} deporte 
 * @param {Object} snapshot - Datos traídos desde Firebase
 */
export function cargarEstadisticasDeporte(deporte, snapshot) {
    if (snapshot.empty) return;
    
    let todosLosJugadores = [];
    let todosLosEquipos = [];
    
    snapshot.forEach(doc => {
        const datos = doc.data();
        
        // Desarmar los jugadores del equipo en una lista individual
        if (datos.jugadores) {
            datos.jugadores.forEach(j => {
                // Si el jugador es viejo y no tenía estadísticas, se le regalan
                if (j.goles === undefined && j.puntos === undefined && j.ganados === undefined) {
                    Object.assign(j, generarEstadisticasAleatorias(deporte));
                }
                j.equipo = datos.equipo; 
                j.institucion = datos.institucion;
                todosLosJugadores.push(j);
            });
        }
        
        // Recuperar o inventar las estadísticas de tabla (partidos ganados, perdidos) del equipo
        if (datos.estadisticasEquipo) {
            const eq = Object.assign({}, datos.estadisticasEquipo);
            eq.equipo = datos.equipo;
            todosLosEquipos.push(eq);
        } else {
            const eq = generarEstadisticasEquipoAleatorias(deporte);
            if(Object.keys(eq).length > 0) {
                eq.equipo = datos.equipo;
                todosLosEquipos.push(eq);
            }
        }
    });

    // Dibujar el HTML
    renderizarTablas(deporte, todosLosJugadores, todosLosEquipos);
    
    // Encender el motor mágico que mueve los números (solo 1 vez)
    if (!simuladorActivo) {
        iniciarSimulacionEnVivo(deporte, todosLosJugadores, todosLosEquipos);
        simuladorActivo = true;
    }
}

/**
 * Dibuja las tablas "Top 5" dependiendo del deporte buscando los elementos HTML por su ID.
 * También ordena a los jugadores (sort) de mayor a menor según sus puntos o goles.
 */
export function renderizarTablas(deporte, jugadores, equipos) {
    if (deporte === "futbol") {
        const tbodyGoles = document.getElementById("tabla-goleadores");
        const tbodyAsist = document.getElementById("tabla-asistencias-futbol");
        
        if (tbodyGoles) {
            let sortedGoles = [...jugadores].sort((a,b) => (b.goles || 0) - (a.goles || 0)).slice(0,5);
            tbodyGoles.innerHTML = sortedGoles.map((j, i) => `<tr><td>${i+1}</td><td>${j.nombres} ${j.apellidos}</td><td>${j.equipo}</td><td>${j.goles || 0}</td></tr>`).join('');
        }
        if (tbodyAsist) {
            let sortedAsist = [...jugadores].sort((a,b) => (b.asistencias || 0) - (a.asistencias || 0)).slice(0,5);
            tbodyAsist.innerHTML = sortedAsist.map((j, i) => `<tr><td>${i+1}</td><td>${j.nombres} ${j.apellidos}</td><td>${j.equipo}</td><td>${j.asistencias || 0}</td></tr>`).join('');
        }
    } else if (deporte === "basquet") {
        const tbodyPos = document.getElementById("tabla-posiciones-basquet");
        if (tbodyPos && equipos.length > 0) {
            let sortedEq = [...equipos].sort((a,b) => (b.puntos || 0) - (a.puntos || 0));
            tbodyPos.innerHTML = sortedEq.map((e, i) => `<tr><td>${i+1}</td><td>${e.equipo}</td><td>${e.pj}</td><td>${e.pg}</td><td>${e.pp}</td><td>${e.puntosFavor}</td><td>${e.puntosContra}</td><td>${e.puntosFavor - e.puntosContra}</td><td>${e.puntos}</td></tr>`).join('');
        }
        
        const tbodyPts = document.getElementById("tabla-puntos-basquet");
        if (tbodyPts) {
            let sortedPts = [...jugadores].sort((a,b) => (b.puntos || 0) - (a.puntos || 0)).slice(0,5);
            tbodyPts.innerHTML = sortedPts.map((j, i) => `<tr><td>${i+1}</td><td>${j.nombres} ${j.apellidos}</td><td>${j.equipo}</td><td>${((j.puntos||0)/10).toFixed(1)}</td><td>${j.puntos || 0}</td></tr>`).join('');
        }
        
        const tbodyReb = document.getElementById("tabla-rebotes-basquet");
        if (tbodyReb) {
            let sortedReb = [...jugadores].sort((a,b) => (b.rebotes || 0) - (a.rebotes || 0)).slice(0,5);
            tbodyReb.innerHTML = sortedReb.map((j, i) => `<tr><td>${i+1}</td><td>${j.nombres} ${j.apellidos}</td><td>${j.equipo}</td><td>${j.rebotes || 0}</td></tr>`).join('');
        }
        
        const tbodyAsist = document.getElementById("tabla-asistencias-basquet");
        if (tbodyAsist) {
            let sortedAsist = [...jugadores].sort((a,b) => (b.asistencias || 0) - (a.asistencias || 0)).slice(0,5);
            tbodyAsist.innerHTML = sortedAsist.map((j, i) => `<tr><td>${i+1}</td><td>${j.nombres} ${j.apellidos}</td><td>${j.equipo}</td><td>${j.asistencias || 0}</td></tr>`).join('');
        }
    } else if (deporte === "voley") {
        const tbodyPos = document.getElementById("tabla-posiciones-voley");
        if (tbodyPos && equipos.length > 0) {
            let sortedEq = [...equipos].sort((a,b) => (b.puntos || 0) - (a.puntos || 0));
            tbodyPos.innerHTML = sortedEq.map((e, i) => `<tr><td>${i+1}</td><td>${e.equipo}</td><td>${e.pj}</td><td>${e.pg}</td><td>${e.pp}</td><td>${e.puntos}</td></tr>`).join('');
        }
        
        const tbodyPts = document.getElementById("tabla-puntos-voley");
        if (tbodyPts) {
            let sortedPts = [...jugadores].sort((a,b) => (b.puntos || 0) - (a.puntos || 0)).slice(0,5);
            tbodyPts.innerHTML = sortedPts.map((j, i) => `<tr><td>${i+1}</td><td>${j.nombres} ${j.apellidos}</td><td>${j.equipo}</td><td>${j.puntos || 0}</td></tr>`).join('');
        }
        
        const tbodyBloq = document.getElementById("tabla-bloqueos-voley");
        if (tbodyBloq) {
            let sortedBloq = [...jugadores].sort((a,b) => (b.bloqueos || 0) - (a.bloqueos || 0)).slice(0,5);
            tbodyBloq.innerHTML = sortedBloq.map((j, i) => `<tr><td>${i+1}</td><td>${j.nombres} ${j.apellidos}</td><td>${j.equipo}</td><td>${j.bloqueos || 0}</td></tr>`).join('');
        }
    } else if (deporte === "pingpong") {
        const tbodyInd = document.getElementById("tabla-individual-pingpong");
        if (tbodyInd) {
            // Filtrar solo los que juegan en categoría Individual
            let sortedInd = [...jugadores].filter(j => j.posicion === "Individual").sort((a,b) => (b.ganados || 0) - (a.ganados || 0)).slice(0,5);
            if(sortedInd.length > 0) {
                tbodyInd.innerHTML = sortedInd.map((j, i) => `<tr><td>${i+1}</td><td>${j.nombres} ${j.apellidos}</td><td>${j.institucion}</td><td>${j.ganados || 0}</td><td>${j.sets || 0}</td></tr>`).join('');
            }
        }
        
        const tbodyDobles = document.getElementById("tabla-dobles-pingpong");
        if (tbodyDobles) {
            // Filtrar solo las parejas
            let sortedDobles = [...jugadores].filter(j => j.posicion === "Dobles").sort((a,b) => (b.ganados || 0) - (a.ganados || 0)).slice(0,5);
            if(sortedDobles.length > 0) {
                tbodyDobles.innerHTML = sortedDobles.map((j, i) => `<tr><td>${i+1}</td><td>${j.nombres} ${j.apellidos}</td><td>${j.institucion}</td><td>${j.ganados || 0}</td><td>${j.sets || 0}</td></tr>`).join('');
            }
        }
    }
}

/**
 * setInterval se ejecuta cada 10000 milisegundos (10 segundos).
 * En cada ciclo, escoge un jugador al azar de todo el torneo y le regala un punto.
 */
export function iniciarSimulacionEnVivo(deporte, jugadores, equipos) {
    if (jugadores.length === 0) return;
    
    setInterval(() => {
        // Escoger un índice aleatorio
        const idx = Math.floor(Math.random() * jugadores.length);
        const j = jugadores[idx];
        
        // Regalar el punto
        if (deporte === "futbol") {
            if (Math.random() > 0.5) j.goles = (j.goles || 0) + 1;
            else j.asistencias = (j.asistencias || 0) + 1;
        } else if (deporte === "basquet") {
            const r = Math.random();
            if (r < 0.5) j.puntos = (j.puntos || 0) + 2;
            else if (r < 0.8) j.rebotes = (j.rebotes || 0) + 1;
            else j.asistencias = (j.asistencias || 0) + 1;
        } else if (deporte === "voley") {
            if (Math.random() > 0.5) j.puntos = (j.puntos || 0) + 1;
            else j.bloqueos = (j.bloqueos || 0) + 1;
        } else if (deporte === "pingpong") {
            j.sets = (j.sets || 0) + 1;
            if (j.sets % 3 === 0) j.ganados = (j.ganados || 0) + 1;
        }
        
        // Volver a dibujar para que la tabla reaccione a los nuevos números
        renderizarTablas(deporte, jugadores, equipos);
    }, 10000);
}
