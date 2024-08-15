﻿using API.Entities;
using CloudinaryDotNet.Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace API.Data
{
    public class Seed
    {
        public async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            if(await userManager.Users.AnyAsync())
            {
                return;
            }
            else
            {
                var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
                var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
                var admin = users[0].Clone<AppUser>();

                var roles = new List<AppRole>() 
                { 
                    new AppRole(){Name= "Member"},
                    new AppRole(){Name= "Admin"},
                    new AppRole(){Name= "Moderator"}
                };

                foreach (var role in roles)
                {
                    await roleManager.CreateAsync(role);
                }
                foreach (var user in users)
                {
                    user.UserName = user.UserName.ToLower();
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                    await userManager.AddToRoleAsync(user, "Member");
                }

                admin.UserName = "admin".ToLower();
                await userManager.CreateAsync(admin, "Pa$$w0rd");
                await userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });


            }
        }
    }
}
