using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Diagnostics;
using System.Text;

namespace API.Extensions
{
    public static class ServiceExtensions
    {
        //public static IServiceCollection ConfigureDbContext(this IServiceCollection services, IConfiguration configuration)
        //{
        //    var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

        //    string connStr;

        //    if (env == "Development")
        //    {
        //        // Use connection string from configuration for development
        //        connStr = configuration.GetConnectionString("DefaultConnection");
        //    }
        //    else
        //    {
        //        // Use connection string provided by Heroku for production
        //        var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

        //        if (!string.IsNullOrEmpty(connUrl))
        //        {
        //            // Parse connection URL to connection string for Npgsql
        //            connUrl = connUrl.Replace("postgres://", string.Empty);
        //            var pgUserPass = connUrl.Split('@')[0];
        //            var pgHostPortDb = connUrl.Split('@')[1];
        //            var pgHostPort = pgHostPortDb.Split('/')[0];
        //            var pgDb = pgHostPortDb.Split('/')[1];
        //            var pgUser = pgUserPass.Split(':')[0];
        //            var pgPass = pgUserPass.Split(':')[1];
        //            var pgHost = pgHostPort.Split(':')[0];
        //            var pgPort = pgHostPort.Split(':')[1];

        //            connStr = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb}";

        //        }
        //        else
        //        {
        //            throw new InvalidOperationException("DATABASE_URL environment variable is not set.");
        //        }
        //    }

        //    services.AddDbContext<DataContext>(options =>
        //        options.UseNpgsql(connStr));
        //    return services;
        //}
        #region localhost only for sql server 
        //"DefaultConnection": "Server=LAPTOP-2CL02LQT;Database=DATING_TEST;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;"
        public static IServiceCollection ConfigureDbContext(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<DataContext>(options =>
                 //options.UseSqlServer(connectionString));
                 options.UseNpgsql(connectionString));
            return services;
        }
        #endregion

        public static IServiceCollection ConfigureJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            var secretKey = configuration["Jwt:TokenKey"];
            var issuer = configuration["Jwt:Issuer"];
            var audience = configuration["Jwt:Audience"];

            services.AddIdentityCore<AppUser>(ops =>
            {
                ops.Password.RequireNonAlphanumeric = false;
            })
            .AddRoles<AppRole>()
            .AddRoleManager<RoleManager<AppRole>>()
            .AddSignInManager<SignInManager<AppUser>>()
            .AddRoleValidator<RoleValidator<AppRole>>()
            .AddEntityFrameworkStores<DataContext>();


            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey)),
                        ValidIssuer = issuer,
                        ValidAudience = audience
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"]; // default name access_token
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(path) && path.StartsWithSegments("/hubs"))
                            {
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
                options.AddPolicy("ModeratePhotoRole", policy => policy.RequireRole("Admin", "Moderator" ));
            });


            return services;
        }




        public static IServiceCollection ConfigureCors(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowFromPort4200", policy =>
                {
                    policy.WithOrigins("http://localhost:4200")
                          .AllowCredentials()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });

                options.AddPolicy("CorsPolicy", policy =>
                {
                    policy.WithOrigins("https://datingonlineapp-d19b6b3b1c97.herokuapp.com")
                          .AllowCredentials()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            return services;
        }
    }
}
