# 📅 Plan de Desarrollo: EmprendeControl

Este plan detalla el cronograma, la metodología ágil de desarrollo, las fases de implementación y los riesgos asociados al desarrollo del proyecto **EmprendeControl**.

---

## 1. Metodología de Desarrollo

Para el desarrollo del proyecto se aplicará **Scrum**, permitiendo avances incrementales a través de ciclos iterativos de desarrollo llamados **Sprints**.

* **Duración del Sprint:** 2 semanas.
* **Roles:**
  * **Product Owner / Analista:** Responsable de definir los requerimientos detallados y priorizar el Backlog de Producto. (Jenifer Rodriguez)
  * **Desarrollador (Full Stack):** Responsable de la codificación del frontend (React + Capacitor), backend (Express) y base de datos (MySQL). (Jenifer Rodriguez)
* **Eventos:**
  * **Sprint Planning:** Al inicio de cada sprint para definir qué características se construirán.
  * **Sprint Review & Retrospective:** Al finalizar cada sprint para evaluar el incremento de software y plantear mejoras.

---

## 2. Cronograma de Sprints (10 Semanas)

El desarrollo del proyecto se ha estructurado en 5 fases organizadas en 4 sprints principales y una fase de inicio:

### 📋 Fase 1: Planificación, Diseño e Inicialización (Semanas 1 y 2)
* **Actividades:**
  * Definición de historias de usuario y requisitos finales.
  * Diseño de mockups y wireframes responsive para pantallas móviles y de escritorio.
  * Inicialización del repositorio git y configuración del espacio de trabajo.
* **Entregables:**
  * Documentación inicial del proyecto.
  * Wireframes de la interfaz de usuario.

---

### 💻 Sprint 1: Backend y Base de Datos MySQL (Semanas 3 y 4)
* **Objetivo:** Tener la base de datos levantada y la API REST lista para operaciones de datos básicas.
* **Tareas:**
  * Montar y configurar la base de datos `db_emprendecontrol` en **XAMPP**.
  * Crear el servidor Node.js/Express.
  * Implementar las conexiones con MySQL usando `mysql2`.
  * Desarrollar y probar con Postman/Thunder Client los endpoints REST para productos (inventario) y clientes.
* **Entregable:** API REST funcional y documentada para Clientes e Inventario.

---

### 📱 Sprint 2: Frontend Móvil - Inventario y Clientes (Semanas 5 y 6)
* **Objetivo:** Desarrollar las interfaces del frontend e integrarlas con los primeros endpoints del backend.
* **Tareas:**
  * Inicializar el proyecto React.js y configurar **Capacitor**.
  * Crear la estructura de componentes responsive (Layout, Navbars, Buttons, Modales).
  * Desarrollar la **Pantalla de Inventario** (Listado, visualización de stock, precios, formulario de registro de producto).
  * Desarrollar la **Pantalla de Clientes** (Listado, búsqueda y registro de clientes).
  * Integrar las vistas con los servicios del Backend usando Axios.
* **Entregable:** App móvil responsive con módulos funcionales de Inventario y Clientes conectados a MySQL local.

---

### 🛒 Sprint 3: Frontend Móvil - Ventas y Reportes Básicos (Semanas 7 y 8)
* **Objetivo:** Implementar la lógica del carrito de compras, cálculo de ventas y visualización de gráficos.
* **Tareas:**
  * Desarrollar la **Pantalla de Ventas** (Selección de productos del inventario, agregar al carrito, cálculo de precio total automático).
  * Implementar la transacción de ventas en el backend (actualizar stock y guardar cabecera/detalle).
  * Desarrollar la **Pantalla de Reportes** (Visualizar gráficos simples de ganancias por mes/día y top productos más vendidos).
* **Entregable:** Sistema de ventas completo integrado con el backend e inventario interactivo.

---

### 🧪 Sprint 4 & Fase 3: Pruebas, Ajustes y Compilación Móvil (Semanas 9 y 10)
* **Objetivo:** Validar el sistema integral, corregir fallos y empaquetar la app nativa.
* **Tareas:**
  * Realizar pruebas de rendimiento, usabilidad y adaptabilidad responsive en diferentes dispositivos físicos.
  * Corregir bugs detectados en la integración.
  * Configurar e inicializar la plataforma nativa Android en Capacitor (`npx cap add android`).
  * Compilar la aplicación y generar el archivo `.apk` de prueba.
  * Preparación de la presentación final y manuales de usuario.
* **Entregable:** Archivo APK instalable en Android y aplicación web totalmente funcional conectada al backend.

---

## 3. Gestión y Mitigación de Riesgos

| Riesgo Técnico | Impacto | Probabilidad | Estrategia de Mitigación |
| :--- | :---: | :---: | :--- |
| **Pérdida de conexión entre la App Móvil (Capacitor) y el Servidor Express local** | Alto | Alta | Asegurarse de que el servidor Node.js escuche en todas las interfaces (`0.0.0.0`) y configurar la variable de entorno de API URL del frontend apuntando a la IP local de la máquina en la red local. |
| **Inconsistencias en el stock de inventario** | Alto | Media | Utilizar transacciones SQL en el backend de Node.js al registrar una venta para garantizar que el stock se actualice de manera segura y atómica. |
| **Problemas de compatibilidad con Capacitor en Android** | Medio | Media | Realizar compilaciones de prueba desde las primeras semanas en Android Studio para verificar la compatibilidad de los paquetes npm instalados. |
| **Limitaciones en XAMPP para concurrencia o caída del servicio** | Medio | Baja | Mantener copias de seguridad periódicas del script SQL y utilizar configuraciones estándar sin modificaciones complejas de los puertos por defecto. |
