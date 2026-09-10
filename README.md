# Jabil CRUD - Portal de Administración

Sistema de gestión de Directores y Películas desarrollado con **Angular 22** + **ASP.NET Core 10** + **SQL Server**.

## 🎨 Características Visuales

- **Paleta Ejecutiva**: Azul `#2D5A8E`, Beige `#FAF8F5`, Blanco puro
- **Tipografía**: Inter (Google Fonts)
- **Layout Responsivo**: Side-by-side en desktop, stack en mobile
- **Componentes Reutilizables**: `jb-button`, `jb-input`, `jb-select`, `jb-skeleton`
- **Paginación Server-side**: 5/10/25/50 items por página
- **Skeleton Loaders**: Feedback visual durante carga de datos
- **Validación en Tiempo Real**: Formularios con estados visuales claros
- **Accesibilidad**: ARIA labels, focus-visible, contrast ratios WCAG AA

## 🏗️ Arquitectura

```
Jabil_CRUD/
├── Frontend/          # Angular 22 (Standalone Components)
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/
│   │   │   │   ├── movies/      # CRUD Películas
│   │   │   │   └── directors/   # CRUD Directores
│   │   │   ├── shared/
│   │   │   │   └── components/  # jb-button, jb-input, jb-select, jb-skeleton
│   │   │   ├── core/
│   │   │   │   ├── services/    # API, Toast, Loading
│   │   │   │   └── models/      # TypeScript interfaces
│   │   │   └── app.*            # Shell, routing, theme
│   │   ├── theme.scss           # Design tokens (CSS custom properties)
│   │   └── styles.scss          # Global styles + Material overrides
│   └── package.json
├── Backend/             # ASP.NET Core 10 Web API
│   ├── Controllers/     # MoviesController, DirectorsController
│   ├── Models/          # Entity Framework entities
│   ├── DTOs/            # Data Transfer Objects
│   ├── Data/            # AppDbContext, Migrations
│   └── Middleware/      # Exception handling
├── Database/            # SQL Scripts
└── docker-compose.yml   # Dev environment
```

## 🚀 Quick Start

### Prerrequisitos
- .NET 10 SDK
- Node.js 20+ / npm 10+
- SQL Server (LocalDB, Express o Docker)

### Desarrollo Local

```bash
# 1. Base de datos
cd Jabil_CRUD/Database
sqlcmd -S localhost -i 01_Create_Database_And_Tables.sql

# 2. Backend
cd ../Backend
dotnet restore
dotnet run
# API en https://localhost:7xxx

# 3. Frontend
cd ../Frontend
npm ci
npm run start
# App en http://localhost:4200
```

### Con Docker (Recomendado)

```bash
docker-compose up -d
# SQL Server en localhost:1433
# Backend en http://localhost:5000
# Frontend en http://localhost:4200
```

## 📁 Estructura de Componentes UI

### jb-button
```html
<jb-button variant="primary" [loading]="isSaving" iconStart="save">
  Guardar
</jb-button>
```
**Variantes**: `primary` | `secondary` | `ghost` | `danger` | `outline`  
**Tamaños**: `sm` | `md` | `lg`

### jb-input
```html
<jb-input 
  label="Email" 
  type="email" 
  prefixIcon="mail"
  [required]="true"
  [clearable]="true"
  [(ngModel)]="email">
</jb-input>
```

### jb-select
```html
<jb-select 
  label="Director" 
  [options]="directorOptions()"
  [searchable]="true"
  prefixIcon="person"
  [(ngModel)]="selectedDirector">
</jb-select>
```

### jb-skeleton
```html
<jb-skeleton variant="table-row" [count]="5"></jb-skeleton>
```
**Variantes**: `text` | `circular` | `rectangular` | `table-row`

## 🎯 Design Tokens (CSS Custom Properties)

```css
:root {
  --jabil-primary: #2D5A8E;
  --jabil-primary-hover: #264D7B;
  --jabil-surface: #FFFFFF;
  --jabil-surface-hover: #FAF8F5;
  --jabil-border: #E8DFD4;
  --jabil-text-primary: #171717;
  --jabil-radius-md: 8px;
  --jabil-shadow-1: 0 1px 2px rgba(16,31,47,0.04), 0 1px 3px rgba(16,31,47,0.06);
  --jabil-transition-base: 200ms cubic-bezier(0.2, 0, 0, 1);
  --jabil-space-4: 16px;
}
```

## 📦 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run start` | Dev server con HMR |
| `npm run build` | Build producción |
| `npm run test` | Unit tests (Vitest) |
| `npm run lint` | ESLint + Prettier |
| `dotnet build` | Build backend |
| `dotnet test` | Tests backend |

## 🧪 Testing

```bash
# Frontend
cd Frontend && npm run test

# Backend
cd Backend && dotnet test
```

## 📦 Deployment

### Frontend (Static)
```bash
cd Frontend && npm run build
# Output en dist/Frontend/ → servir con Nginx/Apache/CDN
```

### Backend (Container)
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY . .
EXPOSE 8080
ENTRYPOINT ["dotnet", "JabilTest.API.dll"]
```

## 🤝 Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para guía de:
- Convenciones de commits (Conventional Commits)
- Flujo de ramas (main → develop → feature/*)
- Pull Request template
- Code review checklist

## 📄 Licencia

Proyecto interno Jabil - Evaluación Técnica