# Jabil Application Administrator - CRUD Portal

Este repositorio contiene la prueba técnica para el portal administrativo de directores y películas. Es una aplicación Full-Stack desarrollada con **Angular 22** y **.NET 10**, enfocada en la reactividad, buenas prácticas de arquitectura y manejo de datos relacionales.

## 🛠️ Tecnologías Utilizadas

*   **Frontend:** Angular 22 (Standalone Components, Signals, Control Flow nativo), Angular Material, SCSS.
*   **Backend:** ASP.NET Core Web API (.NET 10), Entity Framework Core.
*   **Base de Datos:** Microsoft SQL Server.

---

## 📋 Requisitos Previos

Asegúrese de tener instaladas las siguientes herramientas en su entorno local antes de ejecutar la aplicación:

*   [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
*   [Node.js](https://nodejs.org/) 20.19 o superior (o una versión compatible con Angular 22)
*   npm 11.19.0, incluido en la versión de Node recomendada. El proyecto declara esta versión en `Frontend/package.json`.
*   [SQL Server](https://www.microsoft.com/es-es/sql-server/sql-server-downloads) (Express o Developer) y SQL Server Management Studio (SSMS) o Azure Data Studio.

La cadena de conexión incluida usa autenticación de Windows contra la instancia `localhost\SQLEXPRESS`. El usuario de Windows que ejecute la API debe tener permisos sobre SQL Server. Si utiliza otra instancia o autenticación, ajuste `Backend/appsettings.json`.

---

## 🚀 Guía de Instalación y Ejecución

Siga estos pasos en orden para levantar el entorno de desarrollo correctamente.

### Paso 1: Configuración de la Base de Datos

1. Abra su gestor de base de datos (SSMS o Azure Data Studio) y conéctese a su instancia de SQL Server.
2. Ejecute `jabil_ttest/Database/01_Create_Database_And_Tables.sql`.
3. El script crea la base `JabilTestDB` y las tablas `Director` y `Movies`. No inserta datos iniciales; los registros se pueden crear desde la aplicación.
4. Si su servidor no es `localhost\SQLEXPRESS`, actualice `DefaultConnection` en `Backend/appsettings.json` antes de iniciar la API.

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
   dotnet run --launch-profile http
   ```
   *La API se ejecutará en `http://localhost:5020`. Mantenga esta terminal abierta.*

### Paso 3: Configuración y Ejecución del Frontend (Angular)

1. Abra una **nueva** terminal y navegue hacia la carpeta del Frontend:
   ```bash
   cd Frontend
   ```
2. Instale las dependencias de Node:
   ```bash
   npm ci
   ```
3. El entorno de desarrollo ya apunta a `http://localhost:5020/api` en `src/environments/environment.development.ts`. Si cambió el puerto del backend, actualice ese archivo.
4. Levante el servidor de desarrollo de Angular:
   ```bash
   npm start
   ```
5. Abra `http://localhost:4200` en el navegador.

---

## 💡 Notas para el Evaluador

*   **Reactividad Optimizada:** El Frontend implementa Signals de Angular para actualizar el DOM de forma reactiva.
*   **Integridad Relacional:** Las películas pertenecen a un director mediante una llave foránea. La eliminación de un director utiliza borrado en cascada, por lo que también elimina sus películas asociadas.
*   **UI/UX:** Se construyeron componentes altamente personalizados (inputs, selects, modales) sobre Angular Material para cumplir con un estándar visual limpio y corporativo, resolviendo problemas complejos de maquetación (Z-Index / Stacking Contexts).

## 🔍 Verificación rápida

Con ambos procesos ejecutándose, estas direcciones deben estar disponibles:

*   API: `http://localhost:5020/swagger`
*   Directores: `http://localhost:5020/api/Directors`
*   Películas: `http://localhost:5020/api/Movies`
*   Frontend: `http://localhost:4200`

La solución `JabilTest.slnx` contiene el proyecto backend. El frontend se ejecuta desde la carpeta `Frontend` con npm.
