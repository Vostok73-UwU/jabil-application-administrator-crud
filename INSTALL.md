# Guía de Instalación - Jabil CRUD

## 📋 Prerrequisitos

| Herramienta | Versión Mínima | Verificación |
|-------------|----------------|--------------|
| .NET SDK | 10.0 | `dotnet --version` |
| Node.js | 20 LTS | `node --version` |
| npm | 10+ | `npm --version` |
| SQL Server | 2019+ / LocalDB | `sqlcmd -?` |
| Git | 2.40+ | `git --version` |
| Docker (opcional) | 24+ | `docker --version` |

---

## 🗄️ 1. Base de Datos

### Opción A: SQL Server LocalDB (Windows)
```powershell
# Verificar si LocalDB está instalado
sqllocaldb info

# Crear instancia si no existe
sqllocaldb create MSSQLLocalDB

# Ejecutar script de creación
cd Jabil_CRUD\Database
sqlcmd -S "(localdb)\MSSQLLocalDB" -i 01_Create_Database_And_Tables.sql
```

### Opción B: SQL Server Express / Developer
```bash
# Con autenticación Windows
sqlcmd -S localhost -i 01_Create_Database_And_Tables.sql

# Con usuario SQL
sqlcmd -S localhost -U sa -P "TuPassword" -i 01_Create_Database_And_Tables.sql
```

### Opción C: Docker (Multiplataforma)
```bash
# Solo base de datos
docker run -d \
  --name jabil-db \
  -e ACCEPT_EULA=Y \
  -e MSSQL_SA_PASSWORD="JabilTest2024!" \
  -p 1433:1433 \
  mcr.microsoft.com/mssql/server:2022-latest

# Esperar 30s y ejecutar script
sleep 30
docker exec -i jabil-db /opt/mssql-tools18/bin/sqlcmd \
  -C -S localhost -U sa -P "JabilTest2024!" \
  -i /tmp/01_Create_Database_And_Tables.sql
```

**Verificar creación:**
```sql
USE JabilTestDB;
SELECT * FROM Director;
SELECT * FROM Movies;
```

---

## ⚙️ 2. Backend (ASP.NET Core 10)

### Configuración
```bash
cd Jabil_CRUD/Backend

# Copiar configuración de desarrollo
cp appsettings.Development.json.example appsettings.Development.json
# Editar ConnectionStrings.DefaultConnection si es necesario
```

**appsettings.Development.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=JabilTestDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Logging": {
    "LogLevel": { "Default": "Information", "Microsoft.AspNetCore": "Warning" }
  }
}
```

### Ejecutar
```bash
# Restaurar paquetes
dotnet restore

# Aplicar migraciones (si usa EF Core migrations)
dotnet ef database update

# Ejecutar en desarrollo
dotnet run --environment Development

# Verificar Swagger UI
# https://localhost:7xxx/swagger
```

### Puertos por defecto
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001` / `https://localhost:7xxx`

---

## 🌐 3. Frontend (Angular 22)

### Instalación
```bash
cd Jabil_CRUD/Frontend

# Instalar dependencias (usa package-lock.json)
npm ci

# Verificar configuración de entorno
cat src/environments/environment.development.ts
```

**environment.development.ts:**
```typescript
export const environment = {
  apiUrl: 'https://localhost:7xxx/api'  // Ajustar al puerto del backend
};
```

### Ejecutar
```bash
# Desarrollo con HMR
npm run start
# Abre http://localhost:4200

# Build producción
npm run build
# Output en dist/Frontend/
```

---

## 🐳 4. Docker Compose (Todo en Uno)

### docker-compose.yml
```yaml
version: '3.8'

services:
  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      ACCEPT_EULA: Y
      MSSQL_SA_PASSWORD: JabilTest2024!
    ports:
      - "1433:1433"
    volumes:
      - db_data:/var/opt/mssql
      - ./Database:/docker-entrypoint-initdb.d
    healthcheck:
      test: /opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa -P "JabilTest2024!" -Q "SELECT 1"
      interval: 10s
      timeout: 5s
      retries: 10

  api:
    build:
      context: ./Backend
      dockerfile: Dockerfile
    environment:
      ASPNETCORE_ENVIRONMENT: Development
      ConnectionStrings__DefaultConnection: "Server=db;Database=JabilTestDB;User=sa;Password=JabilTest2024!;TrustServerCertificate=True;"
    ports:
      - "5000:8080"
    depends_on:
      db:
        condition: service_healthy

  web:
    build:
      context: ./Frontend
      dockerfile: Dockerfile
    ports:
      - "4200:80"
    depends_on:
      - api

volumes:
  db_data:
```

### Levantar entorno completo
```bash
cd Jabil_CRUD
docker-compose up -d --build

# Ver logs
docker-compose logs -f api
docker-compose logs -f web

# Verificar
curl http://localhost:5000/health
curl http://localhost:4200
```

---

## ✅ Verificación Post-Instalación

### Checklist
- [ ] Base de datos `JabilTestDB` creada con tablas `Director` y `Movies`
- [ ] Backend responde en `/swagger` con 200 OK
- [ ] Frontend carga en `http://localhost:4200`
- [ ] CRUD Directores: Create, Read, Update, Delete funcionan
- [ ] CRUD Películas: Create, Read, Update, Delete funcionan
- [ ] Paginación funciona (cambiar página, page size)
- [ ] Búsqueda/filtrado funciona
- [ ] Validaciones de formulario muestran errores
- [ ] Toast notifications aparecen en operaciones

### URLs de Verificación
| Componente | URL | Esperado |
|------------|-----|----------|
| Swagger API | `https://localhost:7xxx/swagger` | UI interactiva |
| Health Check | `http://localhost:5000/health` | `Healthy` |
| Frontend | `http://localhost:4200` | App carga |
| Directores | `http://localhost:4200/directors` | Tabla + Formulario |
| Películas | `http://localhost:4200/movies` | Tabla + Formulario |

---

## 🔧 Troubleshooting Común

### Error: "Login failed for user 'sa'"
```bash
# Verificar contraseña en docker-compose.yml y appsettings
# SQL Server requiere contraseña compleja (8+ chars, mayúscula, número, símbolo)
```

### Error: "Port 1433 already in use"
```bash
# Detener SQL Server local
net stop MSSQLSERVER
# O cambiar puerto en docker-compose.yml
```

### Error: "CORS policy" en frontend
```csharp
// Backend/Program.cs - Verificar que UseCors esté antes de UseAuthorization
app.UseCors("AllowAngularApp");
app.UseAuthorization();
```

### Error: "NG8001: 'mat-form-field' is not a known element"
```bash
# Verificar que MatFormFieldModule esté en imports del componente
```

### Base de datos vacía / datos no cargan
```bash
# Verificar conexión
dotnet ef migrations list --project Backend

# Recrear si es necesario
dotnet ef database drop --force
dotnet ef database update
```

---

## 📞 Soporte

Para problemas de instalación:
1. Verificar prerrequisitos con `dotnet --info` y `node --version`
2. Revisar logs: `docker-compose logs` o `dotnet run` output
3. Comprobar puertos disponibles: `netstat -an | findstr "1433\|5000\|4200"`