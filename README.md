# 🏔️ Life OS Minimalista

> "La claridad precede a la competencia."Este no es solo un gestor de tareas; es un sistema operativo para alinear tu día a día con tus objetivos a largo plazo, diseñado para reducir la fricción y aumentar el foco.

- Web: https://life-os-lemon.vercel.app/

## 🧠 Parte 1: Filosofía y Flujo de Trabajo

El sistema se basa en la metodología **PARA** (Projects, Areas, Resources, Archives) y **GTD** (Getting Things Done), pero simplificado al extremo para evitar la "fatiga de gestión".

### 1. La Jerarquía de la Claridad

El sistema organiza tu vida en tres niveles de altitud:

1. **🎯 Metas (El Norte):** Son tus grandes objetivos a medio/largo plazo (ej: "Libertad Financiera", "Cuerpo Atlético").

- Categorías: Ayudan a equilibrar las áreas de tu vida (Profesional, Salud, Personal...).
- Estado: Pueden estar **Activas** o en la **Incubadora** (pausadas para no distraer).

2. **🏗️ Proyectos (El Puente):** Son conjuntos de acciones concretas necesarias para lograr una Meta (ej: "Lanzar Web Personal", "Plan de Entrenamiento 5k").

- Un proyecto siempre pertenece a una Meta.
- También pueden enviarse a la **Incubadora**.

3. **⚡ Tareas (La Acción):** La unidad mínima de trabajo.

- Siguiente Paso: La primera tarea no completada de un proyecto se destaca automáticamente como el "siguiente paso inmediato".

### 2. Los 4 Espacios de Trabajo

- **📦 El Baúl (Inbox):**
  - Tu cerebro es para tener ideas, no para almacenarlas.
  - Todo lo que se te ocurra, escríbelo arriba ("¿Qué tienes en mente?"). Cae aquí.
  - **Regla de Oro:** Procesa el Baúl al final del día. Decide si es una tarea para Hoy, si va a un Proyecto o si es un Deseo.
- **☀️ Hoy (Action Board):**
  - Tu foco láser. Aquí solo debe haber lo que vas a completar hoy.
  - **Sin ruido:** Las tareas de proyectos no aparecen aquí automáticamente; tú decides conscientemente traerlas ("Activar tarea") cuando vas a trabajar en ellas.
- **✨ Deseos (Someday/Maybe):**
  - Cosas que te gustaría hacer "algún día" pero no tienen fecha ni compromiso actual (ej: "Aprender a tocar el ukelele").
  - Están seguros aquí sin ocupar espacio mental.

## 💾 Parte 2: Modelo de Datos (JSON)

Toda la información de la aplicación se almacena localmente en un objeto JSON estructurado. Este es el esquema que utiliza el sistema para las funciones de **Copia de Seguridad (Backup) y Restauración**.

### Estructura General

El archivo `lifeos_backup.json` contiene un único objeto raíz con 4 arrays principales:

ClaveTipoDescripcióncategoriesArray<String>Lista simple de etiquetas para clasificar metas.goalsArray<Object>Tus grandes objetivos.projectsArray<Object>Contenedores de tareas vinculados a metas.tasksArray<Object>Todas las tareas (sueltas, de proyecto, deseos, inbox).

#### Ejemplo de JSON Completo

```json
{
  "categories": ["Profesional", "Salud", "Desarrollo Personal", "Otros"],
  "goals": [
    {
      "id": "g1709392811",
      "title": "Libertad Financiera",
      "description": "Generar 4000€/mes pasivos",
      "category": "Profesional",
      "status": "active"
      // status: 'active' | 'incubator'
    }
  ],
  "projects": [
    {
      "id": "p1709399123",
      "title": "Lanzar Curso Online",
      "goalId": "g1709392811",
      "status": "active",
      "active": true // Deprecated (legacy)
    }
  ],
  "tasks": [
    {
      "id": "t1709400001",
      "title": "Comprar dominio web",
      "type": "project",
      // type: 'normal' (suelta) | 'project' (vinculada)

      "status": "pending",
      // status:
      // 'inbox'   -> En el Baúl
      // 'active'  -> En la vista "Hoy"
      // 'pending' -> Guardada en proyecto (oculta de Hoy)
      // 'wish'    -> En Deseos

      "completed": false,
      "isFavorite": true,
      "projectId": "p1709399123", // ID del proyecto padre (si aplica)
      "steps": [
        {
          "id": "s1",
          "title": "Buscar nombres disponibles",
          "completed": true
        },
        {
          "id": "s2",
          "title": "Comparar precios",
          "completed": false
        }
      ]
    },
    {
      "id": "t1709400002",
      "title": "Llamar al dentista",
      "type": "normal",
      "status": "inbox",
      "completed": false,
      "isFavorite": false,
      "steps": []
    }
  ]
}
```

#### Relaciones Clave

1. **Meta -> Proyecto:**

- Se unen mediante `goalId` en el objeto del proyecto.
- Si borras una Meta, la lógica visual debería avisarte o gestionar los proyectos huérfanos (actualmente se recomienda borrar proyectos antes que la meta).

2. **Proyecto -> Tarea:**

- Se unen mediante `projectId` en el objeto de la tarea.
- `type` debe ser `"project"`.
- Si `status` es `"active"`, la tarea se ve en **Hoy** Y en el **Proyecto**.
- Si `status` es `"pending"`, la tarea solo se ve dentro del **Proyecto**.

3. **Categoría -> Meta:**

   - Es una relación débil por _string_ simple. Si cambias el nombre de una categoría en la configuración, el sistema busca todas las metas con ese _string_ y las actualiza.
