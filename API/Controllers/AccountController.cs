using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Microsoft.Win32;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenSrevice;
        public AccountController(DataContext context,
            IConnectionStringProvider connectionStringProvider,
            ITokenService tokenService
            )
        : base(context, connectionStringProvider)
        {
            this._tokenSrevice = tokenService;  
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Rgister(RegisterDto register )
        {
            if (await UserExists(register.UserName)) return BadRequest("userName Taken");
            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                UserName = register.UserName.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(register.Password)),
                PasswordSalt = hmac.Key
            };

            await _context.Users.AddAsync(user);
            try
            {

            }
            catch (Exception ex) {
                await _context.SaveChangesAsync();
            }

            return Ok(
                    new UserDto() { UserName= user.UserName , Token = _tokenSrevice.CreateToken(user)}
                );
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto login)
        {
            var user = await _context.Users
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.UserName == login.UserName);
            if (user == null)
                return Unauthorized("invalid user Name");
            else
            {
                using var hmac = new HMACSHA512(user.PasswordSalt);
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(login.Password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != user.PasswordHash[i]){
                        return Unauthorized("invalid Password");
                    }
                }
                return Ok(
                   new UserDto() { UserName = user.UserName, Token = _tokenSrevice.CreateToken(user), PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain)?.Url }
               );
            }

        }

        private async Task<bool> UserExists(string userName)
        {
            return await  _context.Users.AnyAsync(user => user.UserName.ToLower() == userName.ToLower());
        }
    }
}
