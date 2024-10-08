﻿using API.Utils;

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
            var cloudinarySettings = new CloudinarySettings
            {
                ApiKey = _configuration["CloudinariySettings:ApiKey"],
                ApiSecret = _configuration["CloudinariySettings:ApiSecret"],
                CloudName = _configuration["CloudinariySettings:CloudName"]
            };

            if (string.IsNullOrEmpty(cloudinarySettings.CloudName))
            {
                throw new ArgumentException("Cloud name must be specified in Account!");
            }

            return cloudinarySettings;
        }
    }
}
