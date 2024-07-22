using API.Interfaces;
using API.Sevices;
using API.Extensions; 

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureDbContext(builder.Configuration);
builder.Services.AddSingleton<IConnectionStringProvider, ConnectionStringProvider>();
builder.Services.AddScoped<ITokenService,TokenService>();
builder.Services.ConfigureJwtAuthentication(builder.Configuration);
builder.Services.AddControllers();
builder.Services.ConfigureCors();

var app = builder.Build();

// Configure middleware and endpoints
app.UseRouting();

app.UseCors(x =>  x.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200"));

app.UseAuthorization(); 
app.UseAuthentication();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();
