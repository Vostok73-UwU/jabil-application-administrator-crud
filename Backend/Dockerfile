# ============================================================
# Backend Dockerfile - ASP.NET Core 10
# ============================================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copiar archivos de proyecto
COPY ["Backend/JabilTest.API.csproj", "Backend/"]
RUN dotnet restore "Backend/JabilTest.API.csproj"

# Copiar todo y compilar
COPY . .
WORKDIR /src/Backend
RUN dotnet publish "JabilTest.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ============================================================
# Runtime stage
# ============================================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080

# Usuario no-root para seguridad
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "JabilTest.API.dll"]