# 📝 Registro de Actividades: Inicialización de EmprendeControl

Este documento resume las actividades técnicas realizadas para poner en marcha la base de datos, el backend y el frontend del proyecto **EmprendeControl**.

---

## 📂 1. Creación de la Estructura de Directorios

Se estableció una estructura cliente-servidor desacoplada para organizar el código de manera eficiente:
* **`database/`**: Almacena los scripts de base de datos SQL.
* **`backend/`**: Contiene la lógica del servidor, modelos de datos y los endpoints REST.
* **`frontend/`**: Aloja el código de la aplicación de usuario construida en React y empaquetada con Capacitor.

---

## 🗄️ 2. Base de Datos (MySQL)

Se creó el script de base de datos en [db_emprendecontrol.sql](file:///c:/Users/user/OneDrive/Documentos/Programacion_Movil/Emprende_control/database/db_emprendecontrol.sql) con la siguiente estructura relacional. Además, se configuró explícitamente el acceso a MySQL en el puerto estándar `3306` y Apache/phpMyAdmin en el puerto alternativo `8080` de XAMPP:
* **`clientes`**: Para almacenar la información de contacto de los clientes.
* **`productos`**: Almacenamiento del catálogo de productos con control de stock y precios de venta.
* **`ventas`**: Registro general de transacciones del negocio.
* **`detalle_ventas`**: Tabla asociativa intermedia que almacena los productos específicos, cantidades y subtotales de cada venta registrada.
* *Tecnología:* El motor de base de datos utilizado es **InnoDB**, asegurando soporte para integridad referencial (Foreign Keys) y transacciones seguras (ACID).

---

## 💻 3. Inicialización y Configuración del Backend

Se configuró el servidor local API REST en la carpeta `backend/` con las siguientes actividades:

1. **Configuración de Dependencias ([package.json](file:///c:/Users/user/OneDrive/Documentos/Programacion_Movil/Emprende_control/backend/package.json)):**
   * Se instaló **Express** como framework web para definir rutas de forma ágil.
   * Se integró **CORS** para habilitar que el cliente móvil (que corre en un host local de Capacitor) se comunique sin bloqueos de seguridad con el backend.
   * Se instaló **Dotenv** para la gestión de credenciales y variables de entorno externas al código.
   * Se incorporó **mysql2** con soporte para promesas (`async/await`) para realizar consultas SQL asíncronas y eficientes.
   * Se configuró **Nodemon** en modo desarrollo para recargar automáticamente el servidor tras realizar cambios.
2. **Variables de Entorno ([.env](file:///c:/Users/user/OneDrive/Documentos/Programacion_Movil/Emprende_control/backend/.env)):**
   * Se configuraron los valores locales por defecto compatibles con el servidor MySQL de **XAMPP** (Host: `localhost`, Usuario: `root`, Password: vacío).
3. **Conexión a MySQL ([db.js](file:///c:/Users/user/OneDrive/Documentos/Programacion_Movil/Emprende_control/backend/config/db.js)):**
   * Se creó un pool de conexiones optimizado que gestiona la disponibilidad del servidor SQL y valida su conexión al arrancar el backend.
4. **Punto de Entrada ([index.js](file:///c:/Users/user/OneDrive/Documentos/Programacion_Movil/Emprende_control/backend/index.js)):**
   * Servidor Express básico escuchando en el puerto `5000` en todas las interfaces de red (`0.0.0.0`) para permitir el acceso de dispositivos móviles en la misma red WiFi local.
   * Se configuró la ruta `/api/status` para diagnosticar el estado del servidor y su conexión activa con la base de datos MySQL local.

---

## 📱 4. Inicialización y Configuración del Frontend

Se creó la interfaz de usuario en la carpeta `frontend/` mediante los siguientes pasos:

1. **Creación del Proyecto:**
   * Se consultó la ayuda del inicializador del framework para asegurar la sintaxis correcta.
   * Se inicializó la aplicación utilizando **Vite** con la plantilla de **React.js** en JavaScript estándar (`--template react`) en modo no interactivo y sobreescribiendo el directorio.
2. **Instalación de Dependencias:**
   * Se ejecutó el comando de instalación de paquetes de npm para descargar React, ReactDOM y las herramientas de compilación de Vite.
3. **Configuración de Capacitor:**
   * Se instalaron e integraron las librerías `@capacitor/core` (core del runtime) y `@capacitor/cli` (CLI para tareas de compilación y sincronización).
   * Se inicializó el archivo de configuración `capacitor.config.json` vinculando la aplicación web de React con el identificador de paquete móvil `com.emprendecontrol.app` y definiendo el directorio de salida de compilación de Vite (`dist`).
   * Se instaló la dependencia `@capacitor/android` y se agregó la plataforma nativa mediante `npx cap add android`, creando la estructura nativa para dispositivos Android en la carpeta `/android/`.

---

## 🗄️ 5. Creación de la Base de Datos Relacional en MySQL (XAMPP)

Para crear la base de datos de manera automática desde la línea de comandos, se implementó y ejecutó un script en Node.js que automatiza el proceso de importación del esquema DDL:

1. **Implementación del Script ([initDb.js](file:///c:/Users/user/OneDrive/Documentos/Programacion_Movil/Emprende_control/backend/scripts/initDb.js)):**
   * El script se conecta al servidor MySQL local (`localhost:3306`) usando las credenciales del archivo `.env`.
   * Valida la existencia de la base de datos `db_emprendecontrol` (creándola en caso de no existir) y posteriormente lee e importa el archivo [db_emprendecontrol.sql](file:///c:/Users/user/OneDrive/Documentos/Programacion_Movil/Emprende_control/database/db_emprendecontrol.sql).
   * Parsea y ejecuta de forma secuencial cada sentencia de creación de tablas.

2. **Ejecución del Comando:**
   * Se ejecutó el script por consola con el siguiente comando en el directorio del backend:
     ```bash
     node scripts/initDb.js
     ```
   * **Resultado de consola obtenido:**
     ```text
     🔌 Conectándose al servidor MySQL en localhost:3306...
     ✅ Conexión inicial al motor MySQL establecida.
     📂 Creando base de datos "db_emprendecontrol" si no existe...
     ✅ Base de datos "db_emprendecontrol" lista.
     🔌 Conectado a la base de datos "db_emprendecontrol".
     📄 Leyendo script SQL desde: .../database/db_emprendecontrol.sql
     ⚙️ Ejecutando sentencias SQL para crear las tablas...
     🎉 ¡Base de datos y tablas de EmprendeControl inicializadas con éxito en XAMPP!
     🔌 Conexión a la base de datos cerrada.
     ```

3. **Verificación de Conectividad Integral:**
   * Tras la inicialización de la BD, se inició el servidor Express (`node index.js`) y se confirmó que el pool de conexiones del backend interactúa correctamente con MySQL, arrojando el siguiente log:
     ```text
     🚀 Servidor Express iniciado y escuchando en http://localhost:5000
     📡 Disponible en la red local en http://<tu-ip-local>:5000
     ✅ Conexión a la base de datos MySQL en XAMPP establecida correctamente.
     ```


