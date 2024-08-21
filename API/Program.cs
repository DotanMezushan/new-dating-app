using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using API.Interfaces;
using API.Extensions;
using API.Services;
using API.Data;
using API.Utils;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using API.SignalR;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigurCloudinarySettings(builder.Configuration);
builder.Services.AddScoped<IPhotoService, PhotoService>();
builder.Services.ConfigureDbContext(builder.Configuration);
builder.Services.AddSingleton<IConnectionStringProvider, ConnectionStringProvider>();
builder.Services.AddSingleton<PresenceTracker>();
builder.Services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
builder.Services.AddScoped<ITokenService,TokenService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ILikesRepository, LikesRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<LogUserActivity>();
builder.Services.ConfigureJwtAuthentication(builder.Configuration);
builder.Services.AddSignalR();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles; 
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.ConfigureCors();



var app = builder.Build();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<DataContext>();
        await context.Database.MigrateAsync();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
        var seeder = new Seed();
        await seeder.SeedUsers(userManager, roleManager);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during migration or seeding");
    }
}

// Configure middleware and endpoints
app.UseRouting();
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:4200", "https://datingonlineapp-d19b6b3b1c97.herokuapp.com"));
app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();//fot index.html
app.UseStaticFiles();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<PresenceHub>("hubs/presence");
    endpoints.MapHub<MessageHub>("hubs/message");
    endpoints.MapFallbackToController("Index", "Fallback");
});

await app.RunAsync();


