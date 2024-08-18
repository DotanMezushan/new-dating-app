using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Win32;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenSrevice;
        private readonly IMapper _mapper;

        public AccountController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            IConnectionStringProvider connectionStringProvider,
            ITokenService tokenService,
            IMapper mapper
            )
        : base( connectionStringProvider)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenSrevice = tokenService;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Rgister(RegisterDto register )
        {
            if (await UserExists(register.UserName)) return BadRequest("userName Taken");
            var user = _mapper.Map<AppUser>(register);

            user.UserName = register.UserName.ToLower();
            
            var result = await _userManager.CreateAsync(user,register.Password);
            if (!result.Succeeded) {
                return BadRequest(result.Errors);
            }

            var roleResult = await _userManager.AddToRoleAsync(user, "Member");
            if (!roleResult.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(
                    new UserDto()
                        { 
                            UserName= user.UserName,
                            Token = await _tokenSrevice.CreateToken(user), 
                            KnowAs = user.KnowAs,
                            Gender = user.Gender,
                        }
                    );
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto login)
        {
                var user = await _userManager.Users
                        .Include(p => p.Photos)
                        .SingleOrDefaultAsync(x => x.UserName == login.UserName.ToLower());
                if (user == null)
                    return Unauthorized("invalid user Name");
                else
                {
                    var result = await _signInManager.CheckPasswordSignInAsync(user, login.Password, false);
                    if (!result.Succeeded) { return Unauthorized(); }
                    return Ok(
                       new UserDto()
                       {
                           UserName = user.UserName,
                           Token = await _tokenSrevice.CreateToken(user),
                           PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain)?.Url,
                           KnowAs = user.KnowAs ,
                           Gender = user.Gender,
                       }
                   );
                }

        }

        private async Task<bool> UserExists(string userName)
        {
            return await  _userManager.Users.AnyAsync(user => user.UserName.ToLower() == userName.ToLower());
        }
    }
}
