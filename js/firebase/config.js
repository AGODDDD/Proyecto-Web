/**
 * =========================================================
 * FIREBASE CONFIG (config.js)
 * =========================================================
 * Este módulo se encarga exclusivamente de guardar las llaves 
 * de acceso de tu base de datos y conectarse a ella.
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Tus credenciales públicas de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDnEoZwwzLMaVkpBI83Oc7RabfGuKkG1Rw",
    authDomain: "olimpiadas-peru.firebaseapp.com",
    projectId: "olimpiadas-peru",
    storageBucket: "olimpiadas-peru.firebasestorage.app",
    messagingSenderId: "343267520867",
    appId: "1:343267520867:web:8671a25e981ed0dd13a356",
    measurementId: "G-GS9JNHYYLY"
};

// Inicializamos la app en el navegador
const app = initializeApp(firebaseConfig);

// Exportamos la conexión "db" para que otros archivos puedan usarla para leer o escribir
export const db = getFirestore(app);
