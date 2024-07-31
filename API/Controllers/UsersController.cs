using API.Data;
using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{

    public class UsersController : BaseApiController
    {
        private readonly IUserRepository userRepository;

        public UsersController(DataContext context, IConnectionStringProvider connectionStringProvider, IUserRepository userRepository, IMapper mapper)
        : base(context, connectionStringProvider, mapper)
        {
            this.userRepository = userRepository;
        }

        [HttpGet("username")]
        [Authorize]
        public async Task<ActionResult<MemberDto>> GetUserByUserName(string userName)
        {
            //var user = await userRepository.GetUserByUserNameAsync(userName);
            //var member = _mapper.Map<MemberDto>(user);
            //return Ok(member);
            return Ok(await userRepository.GetMemberByUserNameAsync(userName));
        }

        [HttpGet("id")]
        [Authorize]
        public async Task<ActionResult<MemberDto>> GetUserByUserId(int id)
        {
            //var user = await userRepository.GetUserByIdAsync(id);
            //var member = _mapper.Map<MemberDto>(user);
            //return Ok(member);
            return Ok(await userRepository.GetMemberByIdAsync(id));


        }

        [HttpGet]
        //[Authorize]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            //var users = await userRepository.GetUsersAsync();
            //var members =  _mapper.Map<IEnumerable<MemberDto>>(users);
            //return Ok(members);
            return Ok(await userRepository.GetMembersAsync());
        }

        //[Authorize]
        //[HttpGet("{id}")]
        //public async Task<ActionResult<MemberDto>> GetUser(int Id)
        //{
        //    var connectionString = _connectionStringProvider.GetConnectionString();
        //    var query = "SELECT * FROM Users WHERE Id = @Id";

        //    using (var connection = new SqlConnection(connectionString))
        //    {
        //        await connection.OpenAsync();

        //        using (var command = new SqlCommand(query, connection))
        //        {
        //            // Add parameter to SQL command
        //            command.Parameters.AddWithValue("@Id", Id);

        //            using (var reader = await command.ExecuteReaderAsync())
        //            {
        //                if (await reader.ReadAsync())
        //                {
        //                    return Ok(new AppUser
        //                    {
        //                        Id = reader.GetInt32(reader.GetOrdinal("Id")),
        //                        UserName = reader.GetString(reader.GetOrdinal("UserName"))
        //                        // Map other properties if necessary
        //                    });
        //                }
        //            }
        //        }
        //    }

        //    return null; // Or handle accordingly
        //}

        [HttpPut]
        [Authorize]
        public async Task<ActionResult> updateUser(MemberUpdateDto memberUpdateDto)
        {
            var userName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await userRepository.GetUserByUserNameAsync(userName);
            try
            {
                user = _mapper.Map(memberUpdateDto, user);

            }
            catch (Exception)
            {

                throw;
            }


             userRepository.Update(user);
            if (await userRepository.SaveAllAsync())
            {
                return NoContent();
            }
            else
            {
                return BadRequest("no user has update");
            }

        }



    }
}
