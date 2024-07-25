using API.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace API.Data
{
    public class Seed
    {
        public async Task SeedUsers(DataContext context)
        {
            if(await context.Users.AnyAsync())
            {
                return;
            }
            else
            {
                var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
                var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
                foreach (var user in users)
                {
                    using var hmac = new HMACSHA512();
                    user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));
                    user.UserName = user.UserName.ToLower();
                    user.PasswordSalt = hmac.Key;
                    
                     context.Users.Add(user);
                }
            }
            await context.SaveChangesAsync();
        }
    }
}
