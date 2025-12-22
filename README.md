# 🏔️ Life OS Minimalista

> "La claridad precede a la competencia."
> Este no es solo un gestor de tareas; es un sistema operativo para alinear tu día a día con tus objetivos a largo plazo, diseñado para reducir la fricción y aumentar el foco.

- **Web App:** https://life-os-lemon.vercel.app/

---

## 🔥 Novedades v2.0: Arquitectura Cloud & PWA

### ☁️ Sincronización Real (Firebase)
El sistema ha migrado de `localStorage` a **Google Firebase**.
- **Base de Datos en la Nube:** Tus datos viven en Firestore. Inicia sesión en tu móvil, tablet o PC y verás exactamente lo mismo.
- **Fuente de Verdad:** La nube siempre manda. Al iniciar sesión, el sistema descarga tu última versión. Ya no hay riesgo de sobrescribir datos antiguos con versiones locales obsoletas.
- **Login Seguro:** Autenticación mediante Google (Gmail).

### 📱 Aplicación Web Progresiva (PWA)
- **Instalable:** Puedes instalar LifeOS como una "app nativa" en tu móvil (iOS/Android) o PC (Chrome/Edge).
- Icono en pantalla de inicio y experiencia pantalla completa (sin barra de navegador).

---

## 🧠 Parte 1: Filosofía y Flujo de Trabajo

El sistema se basa en la metodología **PARA** (Projects, Areas, Resources, Archives) y **GTD** (Getting Things Done), pero simplificado al extremo para evitar la "fatiga de gestión".

### 1. La Jerarquía de la Claridad

El sistema organiza tu vida en tres niveles de altitud:

1.  **🎯 Metas (El Norte):** Son tus grandes objetivos a medio/largo plazo (ej: "Libertad Financiera", "Cuerpo Atlético").
    -   **Categorías:** Ayudan a equilibrar las áreas de tu vida (Profesional, Salud, Personal...).
    -   **Estado:** Pueden estar **Activas** o en la **Incubadora** (pausadas para no distraer).

2.  **🏗️ Proyectos (El Puente):** Son conjuntos de acciones concretas necesarias para lograr una Meta (ej: "Lanzar Web Personal", "Plan de Entrenamiento 5k").
    -   Un proyecto siempre pertenece a una Meta.
    -   También pueden enviarse a la **Incubadora**.

3.  **⚡ Tareas (La Acción):** La unidad mínima de trabajo.
    -   **Siguiente Paso:** La primera tarea no completada de un proyecto se destaca automáticamente.
    -   **Multilínea:** Los títulos largos ahora se leen completos, sin cortes.

### 2. Los 4 Espacios de Trabajo

-   **📦 El Baúl (Inbox):**
    -   Tu cerebro es para tener ideas, no para almacenarlas.
    -   Botón rápido arriba ("¿Qué tienes en mente?"). Todo cae aquí.
    -   **Procesar:** Usa el botón flotante para decidir: ¿Es para Hoy? ¿Es de un Proyecto? ¿Es un Deseo?

-   **☀️ Hoy (Action Board):**
    -   Tu foco láser. Aquí solo debe haber lo que vas a completar hoy.
    -   **Sin ruido:** Las tareas de proyectos no aparecen aquí automáticamente; tú decides conscientemente traerlas ("Activar tarea") cuando vas a trabajar en ellas.
    -   **Limpieza:** Nuevo botón "Escoba" para archivar rápidamente las tareas completadas.

-   **✨ Deseos (Someday/Maybe):**
    -   Cosas que te gustaría hacer "algún día" pero no tienen fecha ni compromiso actual (ej: "Aprender a tocar el ukelele").

---

## 💾 Parte 2: Modelo de Datos (Backup/Export)

Aunque la app usa Firebase, mantenemos la capacidad de **Exportar/Importar** tus datos en formato JSON para que siempre seas dueño de tu información.

### Estructura de Exportación

El archivo `lifeos_backup.json` contiene un único objeto raíz:

| Clave | Tipo | Descripción |
| :--- | :--- | :--- |
| `categories` | `Array<String>` | Lista simple de etiquetas para clasificar metas. |
| `goals` | `Array<Object>` | Tus grandes objetivos. |
| `projects` | `Array<Object>` | Contenedores de tareas vinculados a metas. |
| `tasks` | `Array<Object>` | Todas las tareas (sueltas, de proyecto, deseos, inbox). |

#### Ejemplo de Estructura de Tarea
```json
{
  "id": "t1709400001",
  "title": "Comprar dominio web",
  "type": "project", // 'normal' | 'project'
  "status": "pending", // 'inbox' | 'active' | 'pending' | 'wish'
  "completed": false,
  "isFavorite": true,
  "projectId": "p1709399123", // Si pertenece a un proyecto
  "steps": [
    { "id": "s1", "title": "Subtarea 1", "completed": true }
  ]
}
```

### Notas Técnicas
- **Toast Notifications:** Sistema de alertas animadas para confirmar acciones.
- **Modales:** Diseño responsive mejorado para móvil.
- **Configuración:** La gestión de categorías y el reseteo de cuenta ("Hard Reset") se encuentran en el icono de engranaje.
