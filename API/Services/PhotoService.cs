﻿using API.Interfaces;
using API.Utils;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary cloudinary;

        public PhotoService(IOptions<CloudinarySettings> config , CloudinaryService cloudinaryService)
        {
            var settings = cloudinaryService.GetCloudinarySettings();
            if (settings == null) 
            {
                var acc = new Account(config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret);
                cloudinary = new Cloudinary(acc);
                var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                if (env != "Development")
                {
                    throw new Exception("settings == null");
                }

            }
            else
            {
                var acc = new Account(settings.CloudName, settings.ApiKey, settings.ApiSecret);
                cloudinary = new Cloudinary(acc);

            }


            cloudinary.Api.Secure = true;
        }

        public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();
            if (file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation()
                        .Height(500)
                        .Width(500)
                        .Crop("fill")
                        .Gravity("face") // auto:face לזיהוי פנים אוטומטי
                };

                uploadResult = await cloudinary.UploadAsync(uploadParams);
            }
            return uploadResult;
        }


        public async Task<DeletionResult> DeletePhotoAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await cloudinary.DestroyAsync(deleteParams);
            return result;
        }
    }
}
