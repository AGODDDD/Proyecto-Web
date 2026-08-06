# Olimpiadas Peru 2026

Plataforma web para la gestión del torneo interinstitucional Olimpiadas Perú 2026. Permite registrar instituciones, delegados, equipos y participantes, y visualizar estadísticas en tiempo real para cuatro disciplinas deportivas: Fútbol, Básquet, Vóley y Ping Pong.

## Demo en vivo

[https://olimpiadas-peru.web.app](https://olimpiadas-peru.web.app)

---

## Capturas de pantalla

### Página de inicio
![Página de inicio](https://olimpiadas-peru.web.app/assets/images/logo.png)

> Las capturas completas están disponibles ejecutando el proyecto localmente o visitando la [demo en vivo](https://olimpiadas-peru.web.app).

---

## Funciones principales

- **Registro multistep:** Formulario estructurado en tres etapas — datos de la institución y delegado responsable, creación del equipo, y registro individual de participantes con campos de validación.
- **Estadísticas en tiempo real:** Cada página de deporte muestra una tabla de equipos inscritos con datos cargados en vivo desde Firebase Firestore.
- **Tablas de rendimiento:** Goleadores y asistencias (Fútbol), encestadores y rebotes (Básquet), participantes por modalidad (Ping Pong y Vóley).
- **Buscadores de tabla:** Filtro de búsqueda en tiempo real sobre cada tabla del sitio, sin recargar la página.
- **Modal de contacto:** Ventana flotante accesible desde cualquier página del sitio.
- **Resumen dinámico:** La página de inicio genera automáticamente un bloque de estadísticas globales del torneo (disciplinas, equipos registrados, participantes estimados).
- **Diseño responsivo:** Adaptado para pantallas de escritorio, tablet y móvil mediante breakpoints en CSS.
- **Accesibilidad:** Uso de atributos ARIA, etiquetas semánticas HTML5 y enlace de saltar al contenido principal.

---

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura semántica de todas las páginas |
| CSS3 modularizado | Estilos divididos en 8 archivos por responsabilidad |
| JavaScript ES Modules | Lógica de la aplicación dividida en módulos |
| Firebase Firestore | Base de datos en tiempo real para inscritos |
| Firebase Hosting | Despliegue del sitio en producción |
| Google Fonts (Montserrat, Poppins) | Tipografía |
| Font Awesome 6 | Iconografía |

---

## Estructura del proyecto

```
/
├── index.html            # Página de inicio
├── registro.html         # Formulario de registro
├── futbol.html           # Estadísticas de Fútbol
├── basquet.html          # Estadísticas de Básquet
├── voley.html            # Estadísticas de Vóley
├── pingpong.html         # Estadísticas de Ping Pong
├── 404.html              # Página de error personalizada
├── firebase.json         # Configuración de Firebase Hosting
├── assets/
│   └── images/           # Imágenes del sitio (logo, deportes)
├── css/
│   ├── base.css          # Variables globales y reset
│   ├── layout.css        # Estructura de página y navbar
│   ├── components.css    # Tarjetas, botones, hero
│   ├── forms.css         # Estilos del formulario de registro
│   ├── tables.css        # Estilos de tablas de estadísticas
│   ├── js-panel.css      # Panel y buscadores generados por JS
│   ├── animations.css    # Transiciones y animaciones
│   └── responsive.css    # Media queries para dispositivos
└── js/
    ├── main.js           # Punto de entrada, importa y ejecuta módulos
    ├── firebase/
    │   ├── config.js     # Inicialización y credenciales de Firebase
    │   └── db.js         # Lectura de datos desde Firestore
    ├── form/
    │   └── registro.js   # Validación y envío del formulario
    ├── stats/
    │   ├── generator.js  # Generación de tablas de estadísticas
    │   └── live.js       # Escucha en tiempo real de Firestore
    ├── ui/
    │   └── components.js # Componentes UI (menú activo, modal, buscadores)
    └── utils/
        └── helpers.js    # Utilidades generales (detectar página actual, etc.)
```

---

## Instrucciones para ejecutar localmente

Este proyecto no requiere instalación de dependencias. Solo necesitas un servidor local para que los ES Modules de JavaScript funcionen correctamente.

**Opción A — Con VS Code (recomendado):**

1. Instala la extensión [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) en VS Code.
2. Abre la carpeta del proyecto en VS Code.
3. Haz clic derecho sobre `index.html` y selecciona **"Open with Live Server"**.
4. El sitio se abrirá en `http://127.0.0.1:5500`.

**Opción B — Con Python:**

```bash
# En la raíz del proyecto:
python3 -m http.server 8080
# Luego abre: http://localhost:8080
```

**Opción C — Con Node.js:**

```bash
npx serve .
# Luego abre la URL que indique la terminal
```

> **Nota:** Abrir `index.html` directamente con doble clic en el explorador de archivos **no funcionará** porque los navegadores bloquean los ES Modules en el protocolo `file://`.

---

## Equipo

| Nombre | Contribución |
|---|---|
| Mark Chavez | Arquitectura JavaScript (ES Modules), integración completa con Firebase Firestore, frontend general, lógica de componentes UI, formulario de registro, estadísticas en tiempo real, diseño responsivo |
| Gianella Cabana | CSS base y maquetado del formulario de registro |
| Carlos Medrano | CSS de apoyo y estructura HTML de secciones |
| Christian Tineo | Integrante del equipo |
| Fernando Fuster | Integrante del equipo |

---

## Mi contribución (Mark Chavez)

- Diseño y construcción del sistema de módulos JavaScript (`js/main.js`, `js/firebase/`, `js/form/`, `js/stats/`, `js/ui/`, `js/utils/`)
- Integración completa con Firebase: configuración de Firestore, lectura de datos en tiempo real y envío del formulario de registro
- Arquitectura del CSS modularizado (8 archivos con responsabilidad única cada uno)
- Implementación de los componentes dinámicos: resumen estadístico de inicio, buscadores de tabla, modal de contacto, botón de scroll-to-top y marcado de menú activo
- Despliegue del sitio en Firebase Hosting (`https://olimpiadas-peru.web.app`)
- Gestión del repositorio en GitHub

---

*Proyecto académico — Universidad Tecnológica del Perú (UTP) — 2026*
