import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";

// Tu configuración real de life-os-wind
const firebaseConfig = {
    apiKey: "AIzaSyA7WGEFhhgycYzay7MfLe7_OCsS9nU_MG8",
    authDomain: "life-os-wind.firebaseapp.com",
    projectId: "life-os-wind",
    storageBucket: "life-os-wind.firebasestorage.app",
    messagingSenderId: "963764520908",
    appId: "1:963764520908:web:8d23be3854830daec4bf69"
};

// Inicializamos Firebase con tus datos
const app = initializeApp(firebaseConfig);

// Exportamos las herramientas para que la app las use
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
    localCache: persistentLocalCache()
});