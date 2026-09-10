# Guía de Contribución - Jabil CRUD

## 📋 Flujo de Trabajo

### Ramas
```
main           ← Producción (protegida, solo merges via PR)
develop        ← Integración continua
feature/*      ← Nuevas características
fix/*          ← Correcciones de bugs
hotfix/*       ← Urgentes en producción
```

### Convención de Commits (Conventional Commits)
```
<tipo>(<alcance>): <descripción>

[body opcional]

[footer opcional]
```

**Tipos:**
| Tipo | Descripción |
|------|-------------|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Documentación |
| `style` | Formato, punto y coma, etc. |
| `refactor` | Refactor sin cambio de comportamiento |
| `perf` | Mejora de rendimiento |
| `test` | Tests |
| `chore` | Mantenimiento, build, deps |
| `ci` | CI/CD |

**Ejemplos:**
```
feat(movies): agregar paginación server-side
fix(directors): corregir validación de edad
docs: actualizar README con Docker
refactor(shared): extraer jb-button component
```

---

## 🔄 Proceso de Pull Request

### 1. Crear rama
```bash
git checkout develop
git pull origin develop
git checkout -b feat/nueva-funcionalidad
```

### 2. Desarrollar
- Commits pequeños y atómicos
- Tests para nueva funcionalidad
- Actualizar documentación si aplica

### 3. Push y PR
```bash
git push origin feat/nueva-funcionalidad
# Crear PR en GitHub: base=develop
```

### 4. Template de PR
```markdown
## Descripción
Breve explicación de los cambios

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Breaking change
- [ ] Documentación

## Testing
- [ ] Tests unitarios pasan
- [ ] Tests de integración pasan
- [ ] Verificado manualmente

## Checklist
- [ ] Código sigue style guide
- [ ] Self-review completado
- [ ] Comentarios en código complejo
- [ ] Documentación actualizada
```

---

## ✅ Code Review Checklist

### General
- [ ] Nombres claros y descriptivos
- [ ] Funciones pequeñas (< 30 líneas)
- [ ] Sin código duplicado (DRY)
- [ ] Manejo de errores apropiado

### Frontend (Angular)
- [ ] Standalone components
- [ ] Signals para reactividad
- [ ] OnPush change detection
- [ ] Lazy loading en rutas
- [ ] Accesibilidad (ARIA, focus)

### Backend (C#)
- [ ] Async/await correcto
- [ ] Validación de entrada (FluentValidation)
- [ ] Logging estructurado (Serilog)
- [ ] Transacciones donde corresponda

### Base de Datos
- [ ] Migraciones versionadas
- [ ] Índices en FK y columnas de búsqueda
- [ ] Soft delete si aplica

---

## 🎨 Style Guides

### TypeScript / Angular
```typescript
// ✅ Bueno
@Component({...})
export class MoviesComponent {
  readonly movies = signal<Movie[]>([]);
  
  constructor(private readonly api: ApiService) {}
  
  loadMovies(): void { ... }
}

// ❌ Malo
export class MoviesComponent {
  movies: Movie[] = [];
  api: ApiService;
  
  loadMovies() { ... }
}
```

### C# / .NET
```csharp
// ✅ Bueno
public async Task<ActionResult<MovieDto>> CreateMovie(CreateMovieDto dto)
{
    if (!ModelState.IsValid) return BadRequest(ModelState);
    
    var movie = _mapper.Map<Movie>(dto);
    _context.Movies.Add(movie);
    await _context.SaveChangesAsync();
    
    return CreatedAtAction(nameof(GetMovie), new { id = movie.Id }, _mapper.Map<MovieDto>(movie));
}

// ❌ Malo
public async Task<IActionResult> CreateMovie(CreateMovieDto dto) 
{
    var movie = new Movie { ... };
    _context.Add(movie);
    await _context.SaveChangesAsync();
    return Ok(movie);
}
```

### SCSS
```scss
// ✅ Bueno - usa tokens
.card {
  padding: var(--jabil-space-4);
  border-radius: var(--jabil-radius-md);
  box-shadow: var(--jabil-shadow-1);
}

// ❌ Malo - valores hardcoded
.card {
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
```

---

## 🧪 Testing

### Frontend
```bash
# Unit tests
npm run test

# E2E (cuando esté configurado)
npm run e2e
```

### Backend
```bash
# Unit + Integration
dotnet test

# Con cobertura
dotnet test --collect:"XPlat Code Coverage"
```

### Cobertura Mínima
- **Frontend**: 80% statements, 70% branches
- **Backend**: 80% line coverage

---

## 📦 Versionado

### Semantic Versioning (SemVer)
```
MAJOR.MINOR.PATCH
```

| Cambio | Versión |
|--------|---------|
| Breaking change API | MAJOR + 1 |
| Nueva feature retrocompatible | MINOR + 1 |
| Bug fix | PATCH + 1 |

### Tags
```bash
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0
```

---

## 🚀 Release Process

1. **Prepare**: `git checkout develop && git pull`
2. **Version bump**: Actualizar `package.json`, `.csproj`, `CHANGELOG.md`
3. **Release branch**: `git checkout -b release/v1.2.0`
4. **PR to main**: Merge release branch → main
5. **Tag**: `git tag v1.2.0`
6. **Deploy**: CI/CD automático
7. **Merge back**: main → develop

---

## 🐛 Bug Reports

### Template
```markdown
**Descripción**: Claro y conciso

**Pasos para reproducir**:
1. Ir a...
2. Hacer click en...
3. Ver error...

**Comportamiento esperado**: Qué debería pasar

**Capturas**: Si aplica

**Entorno**:
- OS: Windows 11 / Ubuntu 22.04
- Browser: Chrome 120 / Firefox 121
- .NET: 10.0.x
- Node: 20.x

**Logs**: Adjuntar si es error de servidor
```

---

## 💡 Feature Requests

### Template
```markdown
**Problema**: Qué necesidad resuelve

**Solución propuesta**: Descripción técnica

**Alternativas consideradas**: Otras opciones

**Impacto**: 
- UI/UX: [ ] Sí [ ] No
- API: [ ] Sí [ ] No
- DB: [ ] Sí [ ] No
- Breaking: [ ] Sí [ ] No
```

---

## 📞 Contacto

- **Mantenedor**: [Equipo Jabil]
- **Issues**: GitHub Issues
- **Discusiones**: GitHub Discussions