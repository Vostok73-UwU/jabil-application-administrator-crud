# Jabil Application Administrator - CRUD Portal

Este repositorio contiene la prueba técnica para el portal administrativo de directores y películas. Es una aplicación Full-Stack desarrollada con **Angular 18** y **.NET 10**, enfocada en la reactividad, buenas prácticas de arquitectura y manejo de datos relacionales.

## 🛠️ Tecnologías Utilizadas

*   **Frontend:** Angular 18 (Standalone Components, Signals, Control Flow nativo), Angular Material, SCSS.
*   **Backend:** ASP.NET Core Web API (.NET 10), Entity Framework Core.
*   **Base de Datos:** Microsoft SQL Server.

---

## 📋 Requisitos Previos

Asegúrese de tener instaladas las siguientes herramientas en su entorno local antes de ejecutar la aplicación:

*   [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
*   [Node.js](https://nodejs.org/) (v18 o superior)
*   [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
*   [SQL Server](https://www.microsoft.com/es-es/sql-server/sql-server-downloads) (Express o Developer) y SQL Server Management Studio (SSMS) o Azure Data Studio.

---

## 🚀 Guía de Instalación y Ejecución

Siga estos pasos en orden para levantar el entorno de desarrollo correctamente.

### Paso 1: Configuración de la Base de Datos

1. Abra su gestor de base de datos (SSMS o Azure Data Studio).
2. Localice el archivo del script SQL provisto con este proyecto (el archivo que contiene la creación de tablas e inserciones iniciales).
3. Ejecute el script en su servidor local para generar la base de datos `JabilTestDB` (o el nombre especificado en el script) y poblar las tablas de `Directors` y `Movies`.

### Paso 2: Configuración y Ejecución del Backend (.NET)

1. Abra una terminal y navegue hacia la carpeta del Backend:
   ```bash
   cd Backend
   ```
2. Abra el archivo `appsettings.json` y verifique la cadena de conexión (`DefaultConnection`). Asegúrese de que el `Server` coincida con el nombre de su instancia local de SQL Server (por ejemplo, `Server=localhost\SQLEXPRESS`, `Server=.`, o el nombre de su equipo).
3. Restaure las dependencias del proyecto:
   ```bash
   dotnet restore
   ```
4. Ejecute el servidor de la API:
   ```bash
   dotnet run
   ```
   *La API se ejecutará (usualmente en `http://localhost:5000` o `https://localhost:5001`). Mantenga esta terminal abierta.*

### Paso 3: Configuración y Ejecución del Frontend (Angular)

1. Abra una **nueva** terminal y navegue hacia la carpeta del Frontend:
   ```bash
   cd Frontend
   ```
2. Instale las dependencias de Node:
   ```bash
   npm install
   ```
3. Verifique que el archivo `src/environments/environment.ts` (o el servicio `api.service.ts`) apunte al puerto correcto en el que se está ejecutando su backend (ej. `http://localhost:5000/api`).
4. Compile y levante el servidor de desarrollo de Angular:
   ```bash
   ng serve -o
   ```
   *El comando `-o` abrirá automáticamente la aplicación en su navegador predeterminado en `http://localhost:4200`.*

---

## 💡 Notas para el Evaluador

*   **Reactividad Optimizada:** El Frontend implementa el nuevo motor de reactividad de Angular 18 basado en **Signals** (Writable Signals) para una actualización del DOM instantánea y sin fricciones, prescindiendo del tradicional Change Detection manual.
*   **Manejo de Errores e Integridad Relacional:** Se implementaron validaciones de extremo a extremo. El Backend atrapa violaciones de llaves foráneas (ej. intentar eliminar un director con películas asignadas) y devuelve un formato JSON estructurado que el Frontend intercepta y renderiza mediante un `ToastService` corporativo.
*   **UI/UX:** Se construyeron componentes altamente personalizados (inputs, selects, modales) sobre Angular Material para cumplir con un estándar visual limpio y corporativo, resolviendo problemas complejos de maquetación (Z-Index / Stacking Contexts).
