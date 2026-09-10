## 📝 Descripción

<!-- Explica brevemente qué cambios introduce este PR -->

---

## 🏷️ Tipo de Cambio

- [ ] 🐛 Bug fix (corrección que no rompe funcionalidad existente)
- [ ] ✨ Nueva feature (funcionalidad que no rompe existente)
- [ ] 💥 Breaking change (cambio que rompe compatibilidad)
- [ ] 📚 Documentación
- [ ] ♻️ Refactor / Limpieza
- [ ] ⚡ Performance
- [ ] 🧪 Tests
- [ ] 🔧 Build / CI / Config

---

## 🔗 Issues Relacionados

Closes #<!-- número de issue -->

---

## ✅ Checklist de Código

### General
- [ ] El código sigue las convenciones del proyecto (ESLint/Prettier, dotnet format)
- [ ] Los nombres de variables/funciones son claros y descriptivos
- [ ] No hay código duplicado (DRY)
- [ ] Manejo de errores apropiado (try/catch, Result pattern)
- [ ] Sin `console.log` / `debugger` en código commiteado

### Frontend (Angular)
- [ ] Componentes standalone
- [ ] Signals para reactividad (no RxJS innecesario)
- [ ] ChangeDetectionStrategy.OnPush donde aplica
- [ ] Lazy loading en rutas nuevas
- [ ] Accesibilidad: ARIA labels, focus-visible, contraste
- [ ] Responsive: probado en mobile (<768px) y desktop
- [ ] Design tokens usados (`--jabil-*`) - sin valores hardcoded

### Backend (C#)
- [ ] Async/await correcto (no .Result/.Wait())
- [ ] Validación de entrada (DataAnnotations / FluentValidation)
- [ ] Logging estructurado (ILogger, no Console.WriteLine)
- [ ] Transacciones donde corresponde
- [ ] No exponer entidades EF directamente (usar DTOs)

### Base de Datos
- [ ] Migraciones versionadas (si hay cambios de schema)
- [ ] Índices en FK y columnas de búsqueda frecuente
- [ ] Soft delete implementado si aplica

---

## 🧪 Testing

- [ ] Tests unitarios agregados/actualizados
- [ ] Tests de integración (si aplica)
- [ ] Cobertura mínima: 80% statements / 70% branches
- [ ] Verificado manualmente en navegador
- [ ] Verificado en mobile (Chrome DevTools device toolbar)

```bash
# Frontend
cd Frontend && npm run test

# Backend
cd Backend && dotnet test
```

---

## 📸 Capturas / Evidencia Visual

<!-- Para cambios de UI, adjuntar antes/después -->

| Antes | Después |
|-------|---------|
| ![antes](url) | ![después](url) |

---

## 📦 Impacto

- [ ] **UI/UX**: Cambios visibles para el usuario
- [ ] **API**: Cambios en contratos (endpoints, DTOs)
- [ ] **DB**: Migraciones requeridas
- [ ] **Config**: Variables de entorno / appsettings
- [ ] **Breaking**: Requiere versión MAJOR

---

## 📋 Notas para Revisores

<!-- Contexto adicional, decisiones técnicas, trade-offs, etc. -->

---

## 🚀 Deploy Notes

<!-- Instrucciones especiales para deploy si las hay -->

- [ ] Requiere migración BD: `dotnet ef database update`
- [ ] Requiere rebuild frontend: `npm run build`
- [ ] Cambios en variables de entorno
- [ ] Cache invalidation needed