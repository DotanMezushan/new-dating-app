using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using API.Data;
using API.Interfaces;
using API.Sevices; // Ensure this namespace matches where your DataContext is defined

var builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSingleton<IConnectionStringProvider, ConnectionStringProvider>();

builder.Services.AddControllers(); // Add controllers to the service container

var app = builder.Build();

// Configure middleware and endpoints
app.UseRouting();

app.UseAuthorization(); // Add authorization middleware if needed

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();
