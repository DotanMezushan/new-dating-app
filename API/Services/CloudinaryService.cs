using API.Entities;
using API.Utils;
using Microsoft.Extensions.Configuration;

namespace API.Services
{
    public class CloudinaryService
    {
        private readonly IConfiguration _configuration;

        public CloudinaryService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public CloudinarySettings GetCloudinarySettings()
        {
            var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            if (env == "Development")
            {
                return null;
            }
            else
            {
                return new CloudinarySettings
                {
                    ApiKey = _configuration["CloudinarySettings:ApiKey"],
                    ApiSecret = _configuration["CloudinarySettings:ApiSecret"],
                    CloudName = _configuration["CloudinarySettings:CloudName"]
                };
            }
        }
    }
}
