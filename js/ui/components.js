/**
 * =========================================================
 * COMPONENTES DE INTERFAZ (components.js)
 * =========================================================
 * Aquí viven todas las funciones encargadas de modificar lo que
 * el usuario ve en la pantalla de forma interactiva (botones, ventanas, buscadores).
 */
import { obtenerPaginaActual } from "../utils/helpers.js";
import { escucharResumenGeneral } from "../firebase/db.js";

/**
 * Revisa en qué página estamos (ej. "futbol.html") y pinta
 * el botón correspondiente del menú de navegación superior.
 */
export function marcarMenuActivo() {
    const paginaActual = obtenerPaginaActual();
    const enlaces = document.querySelectorAll(".nav-links a");

    for (const enlace of enlaces) {
        const href = enlace.getAttribute("href");
        if (href === paginaActual) {
            enlace.classList.add("activo");
            enlace.setAttribute("aria-current", "page");
        }
    }
}

/**
 * Crea el bloque de "Resumen dinámico" en index.html usando JavaScript
 * y lo conecta con Firebase para mostrar los datos reales.
 */
export function crearResumenDinamicoInicio() {
    const paginaActual = obtenerPaginaActual();
    const contenedorDeportes = document.querySelector(".sports-showcase");

    // Si no estamos en el inicio, o no existe el contenedor, abortamos.
    if (paginaActual !== "index.html" || !contenedorDeportes) return;

    // 1. Construir la carcasa de HTML
    const panel = document.createElement("section");
    panel.className = "js-panel resumen-dinamico";
    panel.setAttribute("aria-label", "Resumen dinámico del torneo");

    const titulo = document.createElement("h3");
    titulo.textContent = "Resumen dinámico del torneo";

    const descripcion = document.createElement("p");
    descripcion.textContent = "Este bloque ahora se alimenta en tiempo real desde la base de datos Firestore.";

    const grid = document.createElement("div");
    grid.className = "resumen-cards";

    const datos = [
        { id: "res-disciplinas", etiqueta: "Disciplinas" },
        { id: "res-equipos", etiqueta: "Equipos registrados" },
        { id: "res-participantes", etiqueta: "Participantes estimados" }
    ];

    const fragmento = document.createDocumentFragment();

    for (const dato of datos) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "resumen-card";

        const numero = document.createElement("strong");
        numero.id = dato.id;
        numero.textContent = "..."; // Placeholder temporal mientras Firebase carga

        const texto = document.createElement("span");
        texto.textContent = dato.etiqueta;

        tarjeta.appendChild(numero);
        tarjeta.appendChild(texto);
        fragmento.appendChild(tarjeta);
    }

    grid.appendChild(fragmento);
    panel.appendChild(titulo);
    panel.appendChild(descripcion);
    panel.appendChild(grid);

    contenedorDeportes.insertAdjacentElement("afterend", panel);

    // 2. Conectar en tiempo real a Firebase para rellenar los "..."
    escucharResumenGeneral((datosFirebase) => {
        const d = document.getElementById("res-disciplinas");
        const e = document.getElementById("res-equipos");
        const p = document.getElementById("res-participantes");
        
        if (d) d.textContent = datosFirebase.disciplinas || 0;
        if (e) e.textContent = datosFirebase.equipos || 0;
        if (p) p.textContent = datosFirebase.participantes || 0;
    });
}

/**
 * Busca todas las tablas de la página e inyecta una barra de búsqueda 
 * justo encima de ellas. Además maneja el filtrado de filas en tiempo real.
 */
export function activarBuscadoresDeTablas() {
    const tablas = document.querySelectorAll(".table-card table");

    for (const tabla of tablas) {
        const cuerpo = tabla.querySelector("tbody");
        const contenedor = tabla.closest(".table-responsive");

        if (!cuerpo || !contenedor) continue;

        const filas = Array.from(cuerpo.querySelectorAll("tr"));
        const totalFilas = filas.length;

        const herramientas = document.createElement("div");
        herramientas.className = "table-tools";

        const etiqueta = document.createElement("label");
        etiqueta.textContent = "Buscar en esta tabla:";

        const buscador = document.createElement("input");
        buscador.type = "search";
        buscador.className = "search-input";
        buscador.placeholder = "Escribe equipo, jugador o institución";
        buscador.setAttribute("aria-label", "Buscar información en la tabla");

        const contador = document.createElement("p");
        contador.className = "contador-resultado";
        contador.textContent = `Mostrando ${totalFilas} registro(s).`;

        herramientas.appendChild(etiqueta);
        herramientas.appendChild(buscador);
        herramientas.appendChild(contador);

        contenedor.insertBefore(herramientas, tabla);

        // Cuando el usuario escribe algo en el buscador
        buscador.addEventListener("input", () => {
            const texto = buscador.value.trim().toLowerCase();
            let visibles = 0;
            const filasActuales = Array.from(cuerpo.querySelectorAll("tr"));
            const totalFilasActuales = filasActuales.length;

            for (const fila of filasActuales) {
                // Si la tabla está vacía ("Aún no hay inscritos"), no la ocultamos
                if (fila.querySelector("td") && fila.querySelector("td").colSpan === 4 && totalFilasActuales === 1) {
                    visibles++;
                    continue;
                }

                const contenido = fila.textContent.toLowerCase();
                
                // Si la fila contiene el texto buscado, quitamos la clase que la oculta
                if (contenido.includes(texto)) {
                    fila.classList.remove("fila-oculta");
                    visibles++;
                } else {
                    fila.classList.add("fila-oculta");
                }
            }
            contador.textContent = `Mostrando ${visibles} de ${totalFilasActuales} registro(s).`;
        });
    }
}

/**
 * Detecta cuando el usuario baja la pantalla para mostrar 
 * una flecha flotante que te lleva al inicio.
 */
export function activarBotonSubir() {
    const enlaceSubir = document.querySelector(".site-footer a[href='#inicio']");
    if (!enlaceSubir) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 280) {
            enlaceSubir.classList.add("visible");
        } else {
            enlaceSubir.classList.remove("visible");
        }
    });

    enlaceSubir.addEventListener("click", (evento) => {
        evento.preventDefault();
        document.getElementById("inicio").scrollIntoView({ behavior: "smooth" });
    });
}

/**
 * Abre y cierra la ventana emergente de "Contacto" (Modal).
 */
export function activarModalContacto() {
    const contactBtn = document.getElementById('contactBtn');
    const modal = document.getElementById('contactModal');
    const closeBtn = document.querySelector('.close');
    const contactForm = document.getElementById('contactForm');

    if (!contactBtn || !modal || !contactForm) return;

    contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cierra el modal si el usuario clickea fuera de la cajita blanca
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Envío simulado del contacto
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        if (nombre && correo && mensaje) {
            alert(`¡Gracias, ${nombre}! Tu mensaje ha sido enviado correctamente.`);
            modal.style.display = 'none';
            contactForm.reset();
        }
    });
}
