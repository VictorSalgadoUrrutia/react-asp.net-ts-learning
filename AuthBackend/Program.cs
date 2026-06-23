using System.Text;
using AuthBackend.Data;
using AuthBackend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore; // <-- 1. IMPORTAMOS SCALAR

var builder = WebApplication.CreateBuilder(args);

// Configurar Entity Framework con SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Registrar el Servicio de Tokens
builder.Services.AddScoped<TokenService>();

// Configurar Autenticación con JWT
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new ArgumentNullException("Falta la clave secreta JWT.");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// Configurar política de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsReactPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// ---> 2. LA FORMA NATIVA DE .NET 9 DE GENERAR LA DOCUMENTACIÓN <---
builder.Services.AddOpenApi();

var app = builder.Build();

// ---> 3. ACTIVAR LA INTERFAZ VISUAL DE SCALAR <---
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors("CorsReactPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();