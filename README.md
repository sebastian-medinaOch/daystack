# DayStack

DayStack es una aplicación web moderna construida con React y Vite, diseñada para gestionar tareas, organizar proyectos y realizar un seguimiento del tiempo de manera eficiente. Su interfaz intuitiva permite a los usuarios mantener el control de sus actividades diarias, visualizar el progreso en un panel interactivo y registrar el tiempo invertido en cada tarea. La aplicación guarda la información de manera persistente en el navegador para asegurar que no se pierdan los datos.

## 🚀 Funcionalidades Principales

*   **Dashboard (Panel de Control):** Una vista general interactiva que resume el estado actual de las tareas, proyectos y el tiempo.
*   **Gestión de Tareas:** Permite crear, editar, visualizar en detalle y eliminar diferentes tareas con sus estados correspondientes.
*   **Gestión de Proyectos:** Organización y agrupación de tareas bajo proyectos específicos desde una página dedicada (`/projects`).
*   **Time Tracking (Seguimiento de Tiempo):** Herramienta integrada para registrar el tiempo que se dedica a cada actividad de forma dinámica (`/time`).
*   **Búsqueda Rápida:** Funcionalidad para buscar tareas de manera ágil desde la cabecera (Header).
*   **Formularios y Vistas Modales:** Creación intuitiva y visualización detallada (_TaskForm_, _TaskViewModal_) sin cambiar de pestaña.
*   **Persistencia de Datos:** Los datos de tareas, estado, y progreso se guardan localmente en el navegador, permitiendo trabajar sin conexión y sin perder información al recargar la página.

## 📂 Organización y Arquitectura del Código

La arquitectura del proyecto sigue una estructura modular, moderna y organizada, separando el control de los datos, las vistas y los utilitarios:

```text
daystack/
├── public/                 # Archivos estáticos de acceso directo (ej. logos, íconos de la PWA).
├── src/                    # Código fuente principal de la aplicación.
│   ├── assets/             # Recursos estáticos globales importables (imágenes, SVG).
│   ├── components/         # Componentes React reutilizables y secciones principales.
│   │   ├── (Dashboard, TasksPage, ProjectsPage, TimeTracking).jsx
│   │   ├── (TaskForm, TaskItem, TaskList, TaskViewModal).jsx
│   ├── context/            # Contextos de React para la gestión del estado global en toda la app.
│   │   └── TaskContext.jsx # Provee el estado de las tareas, proyectos e historial a cualquier componente interno.
│   ├── lib/                # Librerías utilitarias y servicios auxiliares externos.
│   │   └── storage.js      # Lógica base para la persistencia de datos (interacción con localforage).
│   ├── App.jsx             # Componente raíz. Define el enrutamiento (React Router DOM) y el Layout principal (Sidebar + Secciones).
│   ├── App.css             # Estilos de los contenedores base, Sidebar y la App en general.
│   ├── index.css           # Estilos y variables globales utilizadas en toda la aplicación.
│   └── main.jsx            # Punto de entrada de la aplicación React al DOM (index.html).
├── package.json            # Declaración de dependencias y scripts de npm.
└── vite.config.js          # Configuración del empaquetador y servidor de desarrollo (Vite y PWA).
```

## ⚙️ Requisitos Previos

Para ejecutar este proyecto, necesitas tener instalado en tu computadora:
*   [Node.js](https://nodejs.org/) (Versión recomendada: 18 o superior)
*   Un gestor de paquetes como `npm`, `yarn` o `pnpm` (`npm` viene instalado con Node).

## 💻 Cómo Compilar y Ejecutar Localmente

Sigue estos pasos detallados para configurar y levantar el entorno de desarrollo paso a paso en tu máquina:

1. **Clonar el repositorio:** (Si tienes el proyecto subido a Git)
   ```bash
   git clone <url-del-repositorio>
   cd daystack
   ```

2. **Instalar las dependencias:**
   Ejecuta el siguiente comando para descargar todos los paquetes y librerías necesarias especificadas en `package.json`.
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo:**
   Inicia el entorno de desarrollo local, el cual cuenta con recarga rápida de módulos (_HMR_).
   ```bash
   npm run dev
   ```
   > Una vez que cargue el servidor, abre en tu navegador la dirección que aparezca en consola (por defecto suele ser `http://localhost:5173`).

4. **Compilar para producción (Build):**
   Si deseas preparar el proyecto para ser desplegado en un servidor web, puedes empaquetarlo creando una versión optimizada en la carpeta `dist`.
   ```bash
   npm run build
   ```

5. **Previsualizar la versión de producción:**
   Sirve en tu red local la compilación generada en el paso anterior (`dist`) para corroborar que la versión en producción funciona correctamente.
   ```bash
   npm run preview
   ```

## 🛠 Tecnologías Utilizadas

*   **[React](https://react.dev/):** Biblioteca principal empleada para la construcción de interfaces de usuario.
*   **[Vite](https://vitejs.dev/):** Herramienta rápida de desarrollo y empaquetador eficiente.
*   **[React Router Dom](https://reactrouter.com/):** Manejo dinámico de rutas en la aplicación (_Single Page Application_).
*   **[Lucide React](https://lucide.dev/):** Proveedor principal de los iconos SVG en todo el proyecto.
*   **[Localforage](https://localforage.github.io/localForage/):** Encapsulador de IndexedDB/WebSQL proporcionando almacenamiento de persistencia offline.
*   **[Date-fns](https://date-fns.org/):** Optimizador moderno para el análisis y formato de fechas utilizadas en el 'Time Tracking'.
