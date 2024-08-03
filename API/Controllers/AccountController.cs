using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
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
        private readonly IMapper mapper;

        public AccountController(DataContext context,
            IConnectionStringProvider connectionStringProvider,
            ITokenService tokenService,
            IMapper mapper
            )
        : base(context, connectionStringProvider)
        {
            this._tokenSrevice = tokenService;
            this.mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Rgister(RegisterDto register )
        {
            if (await UserExists(register.UserName)) return BadRequest("userName Taken");
            var user = mapper.Map<AppUser>(register);
            using var hmac = new HMACSHA512();

            user.UserName = register.UserName.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(register.Password));
            user.PasswordSalt = hmac.Key;


            await _context.Users.AddAsync(user);
            try
            {
                await _context.SaveChangesAsync();

            }
            catch (Exception ex) { 

            }


            return Ok(
                    new UserDto() { UserName= user.UserName , Token = _tokenSrevice.CreateToken(user), KnowAs = user.KnowAs}
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
                   new UserDto()
                   {
                       UserName = user.UserName,
                       Token = _tokenSrevice.CreateToken(user),
                       PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain)?.Url,
                       KnowAs = user.KnowAs 
                   }
               );
            }

        }

        private async Task<bool> UserExists(string userName)
        {
            return await  _context.Users.AnyAsync(user => user.UserName.ToLower() == userName.ToLower());
        }
    }
}
