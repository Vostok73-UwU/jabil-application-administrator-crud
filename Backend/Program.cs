using JabilTest.API.Data;
using JabilTest.API.Middleware;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// 1. Agregar servicios de Controladores y Swagger (Documentación)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. Inyectar el DbContext usando la cadena de conexión de appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. Configurar CORS para permitir que Angular se comunique con esta API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy => policy.WithOrigins("http://localhost:4200") // Puerto estándar de Angular
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

// 4. Configurar el pipeline de solicitudes HTTP
app.UseExceptionMiddleware();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// IMPORTANTE: UseCors debe ir antes de UseAuthorization
app.UseCors("AllowAngularApp"); 

app.UseAuthorization();

app.MapControllers();

app.Run();