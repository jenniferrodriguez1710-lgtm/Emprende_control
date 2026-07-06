# 📱 EmprendeControl

> **Aplicación móvil responsive para la gestión eficiente de ventas, inventarios y clientes, diseñada para emprendedores y pequeños negocios.**

---

## 📄 Información del Proyecto

* **Institución:** Instituto Superior Tecnológico Alberto Enríquez
* **Carrera / Área:** Desarrollo de Software
* **Fecha de Presentación:** 28/05/2026
* **Responsable:** Jenifer Rodriguez

---

## 🛠️ Stack Tecnológico

La aplicación está diseñada bajo una **arquitectura cliente-servidor** utilizando tecnologías modernas y responsive:

* **Frontend (Cliente Móvil/Web):**
  * **React.js:** Biblioteca de JavaScript para construir interfaces de usuario interactivas y dinámicas.
  * **Capacitor:** Framework multiplataforma que permite compilar la aplicación React en una app nativa para Android/iOS.
  * **HTML5 & Vanilla CSS:** Para un diseño web responsive personalizado, garantizando flexibilidad y alto rendimiento estético en cualquier tamaño de pantalla.
* **Backend (Servidor):**
  * **Node.js:** Entorno de ejecución para JavaScript en el servidor.
  * **Express.js:** Framework minimalista para la creación de la API REST.
* **Base de Datos:**
  * **MySQL (Local):** Sistema de gestión de bases de datos relacionales, administrado a través de **XAMPP** (servidores Apache y MySQL locales).

---

## 📂 Estructura General del Workspace Propuesta

```text
Emprende_control/
├── frontend/             # Código fuente de la app React + Capacitor
│   ├── public/
│   ├── src/
│   │   ├── components/   # Componentes reutilizables (Botones, Inputs, Cards)
│   │   ├── views/        # Pantallas: Ventas, Inventario, Clientes, Reportes
│   │   ├── assets/       # Imágenes, iconos y estilos globales
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── android/          # Proyecto nativo Android (generado por Capacitor)
│   ├── capacitor.config.json
│   └── package.json
├── backend/              # API REST de Node.js + Express
│   ├── config/           # Configuración de base de datos MySQL
│   ├── controllers/      # Lógica de negocio (controladores)
│   ├── routes/           # Endpoints de la API
│   ├── models/           # Consultas SQL y modelado de datos
│   ├── index.js          # Punto de entrada de la API
│   └── package.json
├── database/             # Scripts SQL para inicialización de la BD
│   └── db_emprendecontrol.sql
├── documentacion_tecnica.md
├── plan_de_desarrollo.md
├── estado_del_proyecto.md
└── README.md
```

---

## ⚙️ Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

1. **Node.js** (Versión 18 o superior)
2. **NPM** (Viene instalado con Node.js)
3. **XAMPP** (Con servicios Apache y MySQL activos)
4. **Android Studio** (Necesario únicamente si deseas compilar y probar la aplicación en un dispositivo Android/Emulador mediante Capacitor)

---

## 🚀 Guía de Inicio Rápido

### 1. Configuración de la Base de Datos (XAMPP)

1. Abre el panel de control de **XAMPP** y arranca los módulos **Apache** y **MySQL**.
2. Dirígete a tu navegador web e ingresa a `http://localhost/phpmyadmin`.
3. Crea una nueva base de datos llamada `db_emprendecontrol`.
4. Importa el archivo SQL que se encuentra en `/database/db_emprendecontrol.sql` (creado en la fase de desarrollo).

---

### 2. Configuración y Ejecución del Backend

1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en un archivo `.env` (puerto del servidor, credenciales de MySQL).
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   El servidor estará disponible en `http://localhost:5000` (o el puerto configurado).

---

### 3. Configuración y Ejecución del Frontend

1. Navega a la carpeta del frontend:
   ```bash
   cd ../frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el entorno de desarrollo en el navegador:
   ```bash
   npm run dev
   ```
   La aplicación se abrirá en `http://localhost:5173`.

---

### 4. Ejecución en Dispositivo Móvil (Android/Capacitor)

Para compilar y ejecutar la aplicación React en tu dispositivo Android a través de Capacitor:

1. Genera la compilación de producción de React:
   ```bash
   npm run build
   ```
2. Sincroniza el código web con el proyecto nativo:
   ```bash
   npx cap sync
   ```
3. Abre el proyecto de Android en Android Studio:
   ```bash
   npx cap open android
   ```
4. Conecta tu teléfono Android (con la depuración USB activada) o arranca un emulador, y presiona el botón **Run** en Android Studio.

*Nota:* Asegúrate de configurar la dirección IP local de tu ordenador (en lugar de `localhost`) en el archivo de configuración del frontend para que el dispositivo móvil se conecte correctamente a tu servidor Express local.
