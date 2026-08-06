/**
 * =========================================================
 * FORMULARIO DE REGISTRO (registro.js)
 * =========================================================
 * Maneja todo lo que sucede cuando el usuario interactúa 
 * con el formulario en registro.html: botones, límites, cálculos y envíos.
 */
import { generarEstadisticasAleatorias, generarEstadisticasEquipoAleatorias } from "../stats/generator.js";
import { guardarRegistro } from "../firebase/db.js";
import { mostrarMensaje, obtenerValor, convertirNombreDeporte } from "../utils/helpers.js";

/**
 * Función principal que "enciende" el formulario y sus eventos.
 */
export function activarFormularioRegistro() {
    const formulario = document.getElementById("formulario-registro");
    if (!formulario) return;

    const deporte = document.getElementById("deporte");
    const btnAgregarParticipante = document.getElementById("btn-agregar-participante");
    const participantesList = document.getElementById("participantes-list");

    // Paneles para mostrar alertas y resúmenes
    const panelMensaje = crearPanelMensaje();
    formulario.appendChild(panelMensaje);

    const panelResumen = crearPanelResumen();
    formulario.appendChild(panelResumen);

    let limiteActual = 30; // Jugadores máximos por defecto

    // Cuando cambian de deporte, calculamos su límite permitido
    deporte.addEventListener("change", () => {
        limiteActual = actualizarLimiteParticipantes(deporte.value, panelMensaje);
    });

    // Evento para el botón de "+ Agregar Participante"
    if (btnAgregarParticipante && participantesList) {
        btnAgregarParticipante.addEventListener("click", () => {
            const entradasActuales = participantesList.querySelectorAll(".participante-entry").length;
            
            // Si llegan al límite del deporte, bloqueamos
            if (entradasActuales >= limiteActual) {
                mostrarMensaje(panelMensaje, `No puedes agregar más participantes. El límite para este deporte es ${limiteActual}.`, "warning");
                return;
            }

            // Clona el bloque completo de inputs del primer jugador
            const primeraEntrada = participantesList.querySelector(".participante-entry");
            const nuevaEntrada = primeraEntrada.cloneNode(true);

            // Limpia los textos que ya se habían escrito al clonar
            const inputs = nuevaEntrada.querySelectorAll("input, select");
            inputs.forEach(input => input.value = "");

            // Añade un botón rojo de eliminar al final de cada jugador extra
            const btnEliminar = document.createElement("button");
            btnEliminar.type = "button";
            btnEliminar.className = "btn btn-ghost btn-eliminar-participante";
            btnEliminar.innerHTML = '<i class="fa-solid fa-trash" aria-hidden="true"></i> Eliminar';
            btnEliminar.style.color = "var(--error)";
            btnEliminar.style.marginTop = "0.5rem";
            
            btnEliminar.addEventListener("click", () => {
                nuevaEntrada.remove();
                panelMensaje.textContent = "";
                panelMensaje.className = "form-message";
            });

            nuevaEntrada.appendChild(btnEliminar);
            participantesList.appendChild(nuevaEntrada);
        });
    }

    // Calcula la edad en vivo al tipear el año de nacimiento
    participantesList.addEventListener("input", (evento) => {
        if (evento.target.classList.contains("input-nacimiento")) {
            mostrarEdadCalculada(evento.target.value, panelMensaje);
        }
    });

    // Acción principal: Cuando le dan clic a "Registrar"
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault(); // Evita que la página se recargue (comportamiento default HTML)

        const datos = obtenerDatosFormulario();
        const validacion = validarRegistro(datos);

        if (!validacion.correcto) {
            mostrarMensaje(panelMensaje, validacion.mensaje, "warning");
            return;
        }

        // Si pasó las validaciones, lo mandamos a Firebase
        guardarRegistro(datos)
            .then(() => {
                mostrarResumenRegistro(datos, panelResumen);
                mostrarMensaje(panelMensaje, "Registro enviado correctamente. Los datos fueron guardados en Firebase.", "success");
                alert("Registro completado correctamente y guardado en la nube.");
                formulario.reset(); // Limpiamos todo tras terminar
            })
            .catch((error) => {
                console.error("Error guardando documento: ", error);
                mostrarMensaje(panelMensaje, "Hubo un error de conexión con la base de datos.", "warning");
            });
    });

    // Acción secundaria: Cuando el botón borrar/resetear se clickea
    formulario.addEventListener("reset", () => {
        setTimeout(() => {
            panelMensaje.textContent = "";
            panelMensaje.className = "form-message";
            panelResumen.textContent = "";
            panelResumen.className = "registro-resumen oculto";
            
            // Borramos los jugadores extras y dejamos solo 1
            if (participantesList) {
                const entradas = participantesList.querySelectorAll(".participante-entry");
                for (let i = 1; i < entradas.length; i++) {
                    entradas[i].remove();
                }
            }
        }, 0);
    });
}

function crearPanelMensaje() {
    const panel = document.createElement("p");
    panel.className = "form-message";
    panel.setAttribute("aria-live", "polite");
    return panel;
}

function crearPanelResumen() {
    const panel = document.createElement("div");
    panel.className = "registro-resumen oculto";
    panel.setAttribute("aria-live", "polite");
    return panel;
}

/**
 * Devuelve el número máximo de jugadores permitidos.
 */
function actualizarLimiteParticipantes(deporteSeleccionado, panelMensaje) {
    let maximo = 30;
    let recomendacion = "Seleccione un deporte para aplicar una recomendación.";

    switch (deporteSeleccionado) {
        case "futbol":
            maximo = 18;
            recomendacion = "Fútbol: se permite registrar hasta 18 participantes.";
            break;
        case "basquet":
            maximo = 12;
            recomendacion = "Básquet: se permite registrar hasta 12 participantes.";
            break;
        case "voley":
            maximo = 14;
            recomendacion = "Vóley: se permite registrar hasta 14 participantes.";
            break;
        case "pingpong":
            maximo = 4;
            recomendacion = "Ping pong: se permite registrar hasta 4 participantes.";
            break;
        default:
            maximo = 30;
            recomendacion = "Seleccione un deporte válido.";
            break;
    }

    mostrarMensaje(panelMensaje, recomendacion, "info");
    return maximo;
}

/**
 * Muestra alertas si el participante es muy joven o muy mayor.
 */
function mostrarEdadCalculada(valorNacimiento, panelMensaje) {
    const anioNacimiento = parseInt(valorNacimiento, 10);
    if (Number.isNaN(anioNacimiento)) return;
    const anioTorneo = 2026;
    const edad = anioTorneo - anioNacimiento;

    if (edad < 5 || edad > 80) {
        mostrarMensaje(panelMensaje, "Revise el año de nacimiento ingresado.", "warning");
    } else {
        mostrarMensaje(panelMensaje, `Edad calculada para el torneo 2026: ${edad} año(s).`, "info");
    }
}

/**
 * Recorre todos los inputs de la pantalla HTML, recoge el texto que
 * ha ingresado el usuario y arma un objeto JSON listo para enviar a Firebase.
 */
function obtenerDatosFormulario() {
    const jugadores = [];
    const entradas = document.querySelectorAll(".participante-entry");
    const deporteSeleccionado = obtenerValor("deporte");
    
    entradas.forEach(entrada => {
        const jugador = {
            nombres: entrada.querySelector(".input-nombres").value.trim(),
            apellidos: entrada.querySelector(".input-apellidos").value.trim(),
            dniParticipante: entrada.querySelector(".input-dni").value.trim(),
            nacimiento: parseInt(entrada.querySelector(".input-nacimiento").value.trim(), 10),
            posicion: entrada.querySelector(".input-posicion").value.trim()
        };
        
        // Inyectar datos inventados solo para que el simulador funcione al registrar a un equipo real
        const estadisticas = generarEstadisticasAleatorias(deporteSeleccionado);
        Object.assign(jugador, estadisticas);
        
        jugadores.push(jugador);
    });

    return {
        institucion: obtenerValor("institucion"),
        ruc: obtenerValor("ruc"),
        delegado: obtenerValor("delegado"),
        dniDelegado: obtenerValor("dni-delegado"),
        email: obtenerValor("email"),
        telefono: obtenerValor("telefono"),
        equipo: obtenerValor("nombre-equipo"),
        categoria: obtenerValor("categoria"),
        deporte: deporteSeleccionado,
        estadisticasEquipo: generarEstadisticasEquipoAleatorias(deporteSeleccionado), // Inventadas
        jugadores: jugadores,
        terminos: document.getElementById("terminos") ? document.getElementById("terminos").checked : false
    };
}

/**
 * Reglas de negocio para no dejar pasar datos erróneos a Firebase.
 */
function validarRegistro(datos) {
    if (!datos.institucion || !datos.delegado || !datos.equipo) {
        return { correcto: false, mensaje: "Complete los campos obligatorios de la institución y equipo." };
    }

    if (!/^\d{11}$/.test(datos.ruc)) {
        return { correcto: false, mensaje: "El RUC debe tener exactamente 11 dígitos." };
    }

    if (!/^\d{8}$/.test(datos.dniDelegado)) {
        return { correcto: false, mensaje: "El DNI del delegado debe tener 8 dígitos." };
    }

    if (!/^\d{9}$/.test(datos.telefono)) {
        return { correcto: false, mensaje: "El teléfono debe tener 9 dígitos." };
    }

    if (!datos.email.includes("@") || !datos.email.includes(".")) {
        return { correcto: false, mensaje: "Ingrese un correo electrónico válido." };
    }

    if (!datos.deporte || !datos.categoria) {
        return { correcto: false, mensaje: "Seleccione categoría y deporte." };
    }

    if (!datos.jugadores || datos.jugadores.length === 0) {
        return { correcto: false, mensaje: "Debe agregar al menos un participante." };
    }

    const limite = obtenerLimitePorDeporte(datos.deporte);
    if (datos.jugadores.length > limite) {
        return { correcto: false, mensaje: `El deporte seleccionado permite máximo ${limite} participantes.` };
    }

    // Validaciones exclusivas para cada jugador individual
    for (let i = 0; i < datos.jugadores.length; i++) {
        const j = datos.jugadores[i];
        if (!j.nombres || !j.apellidos) {
            return { correcto: false, mensaje: `El jugador ${i+1} no tiene nombres o apellidos completos.` };
        }
        if (!/^\d{8}$/.test(j.dniParticipante)) {
            return { correcto: false, mensaje: `El DNI del jugador ${i+1} debe tener 8 dígitos.` };
        }
        if (Number.isNaN(j.nacimiento) || j.nacimiento < 1900 || j.nacimiento > 2026) {
            return { correcto: false, mensaje: `Ingrese un año de nacimiento válido para el jugador ${i+1}.` };
        }
        if (!j.posicion) {
            return { correcto: false, mensaje: `Seleccione la posición o modalidad para el jugador ${i+1}.` };
        }
    }

    if (!datos.terminos) {
        return { correcto: false, mensaje: "Debe aceptar los términos y condiciones para continuar." };
    }

    return { correcto: true, mensaje: "Datos validados correctamente." };
}

function obtenerLimitePorDeporte(deporte) {
    switch (deporte) {
        case "futbol": return 18;
        case "basquet": return 12;
        case "voley": return 14;
        case "pingpong": return 4;
        default: return 30;
    }
}

function mostrarResumenRegistro(datos, panelResumen) {
    panelResumen.textContent = "";
    panelResumen.className = "registro-resumen";

    const titulo = document.createElement("h3");
    titulo.textContent = "Resumen del último registro";

    const lista = document.createElement("ul");

    const items = [
        `Institución: ${datos.institucion}`,
        `Equipo: ${datos.equipo}`,
        `Deporte: ${convertirNombreDeporte(datos.deporte)}`,
        `Jugadores registrados: ${datos.jugadores.length}`
    ];

    for (const item of items) {
        const li = document.createElement("li");
        li.textContent = item;
        lista.appendChild(li);
    }

    panelResumen.appendChild(titulo);
    panelResumen.appendChild(lista);
}
