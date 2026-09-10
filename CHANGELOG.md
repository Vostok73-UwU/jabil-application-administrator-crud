# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Server-side pagination en tablas Movies y Directors
- Skeleton loaders para feedback visual durante carga
- Componentes reutilizables: `jb-button`, `jb-input`, `jb-select`, `jb-skeleton`
- Layout side-by-side (formulario + tabla) con sticky form
- Duración auto-formateada (HH:mm:ss) en formulario Movies
- Select dropdown con fondo sólido y búsqueda integrada
- Tema ejecutivo Jabil (Azul #2D5A8E, Beige #FAF8F5, Blanco)
- Fuente Inter de Google Fonts
- Design tokens via CSS custom properties (`--jabil-*`)
- Dark mode toggle (removido por solicitud)

### Changed
- Migración de Material Toolbar a header custom con backdrop-blur
- Formularios migrados a componentes `jb-input`/`jb-select`/`jb-button`
- Tablas con header uppercase, letter-spacing, row hover states
- Empty states ilustrados con iconos
- Status badges semánticos (Activo/Inactivo)

### Fixed
- Select dropdown transparente en Movies
- Dark mode toggle no aplicaba tema
- Imports relativos en componentes shared

### Removed
- Dark mode toggle del header
- Dependencias no usadas

## [1.0.0] - 2026-09-09

### Added
- CRUD completo Directores (Create, Read, Update, Delete)
- CRUD completo Películas (Create, Read, Update, Delete)
- API REST con ASP.NET Core 10 + EF Core
- Base de datos SQL Server con FK y cascada
- Frontend Angular 22 con Signals y Standalone Components
- Angular Material 3 con tema personalizado
- Toast notifications (success, error, warning, info)
- Loading overlay global
- Validación de formularios client-side
- Confirmación antes de eliminar

### Technical
- Arquitectura limpia: Features + Shared + Core
- Repository pattern en backend
- DTOs para transferencia de datos
- PagedResult para paginación
- CORS configurado para Angular dev server
- Swagger/OpenAPI documentation

---

## Template para próximas versiones

## [X.Y.Z] - YYYY-MM-DD

### Added
- 

### Changed
- 

### Deprecated
- 

### Removed
- 

### Fixed
- 

### Security
-