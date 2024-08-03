using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CloudinaryDotNet.Actions;


namespace API.Controllers
{

    public class UsersController : BaseApiController
    {
        private readonly IUserRepository userRepository;
        private readonly IPhotoService photoService;

        public UsersController(
            DataContext context,
            IConnectionStringProvider connectionStringProvider,
            IUserRepository userRepository,
            IMapper mapper,
            IPhotoService photoService
            )
        : base(context, connectionStringProvider, mapper)
        {
            this.userRepository = userRepository;
            this.photoService = photoService;
        }

        [HttpGet("username" , Name ="GetUser")]
        [Authorize]
        public async Task<ActionResult<MemberDto>> GetUserByUserName(string userName)
        {
            return Ok(await userRepository.GetMemberByUserNameAsync(userName));
        }

        [HttpGet("id")]
        [Authorize]
        public async Task<ActionResult<MemberDto>> GetUserByUserId(int id)
        {
            return Ok(await userRepository.GetMemberByIdAsync(id));
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            return Ok(await userRepository.GetMembersAsync());
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult> updateUser(MemberUpdateDto memberUpdateDto)
        {
            var userName = CliamsPrinipleExtensions.GetUserName(User);
            var user = await userRepository.GetUserByUserNameAsync(userName);
            user = _mapper.Map(memberUpdateDto, user);
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

        [HttpPost("add-photo")]
        [Authorize]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var userName = CliamsPrinipleExtensions.GetUserName(User);
            if (userName.Length > 0)
            {
                var user = await userRepository.GetUserByUserNameAsync(User.GetUserName());
                var result = await photoService.AddPhotoAsync(file);
                if (result.Error != null && result.Error.Message != null) { 
                    return BadRequest(result.Error.Message);
                }
                var photo = new Photo()
                {
                    Url = result.SecureUri.AbsoluteUri,
                    PublicId = result.PublicId
                };

                if (user.Photos.Count == 0)
                {
                    photo.IsMain = true;
                }

                user.Photos.Add(photo);
                if (await userRepository.SaveAllAsync()) {
                    return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
                }
                else
                {
                    return BadRequest("problem adding photo");
                }

            }
            else
            {
                return BadRequest("problem with User name security env");
            }

        }

        [HttpPut("set-main-photo/{photoId}")]
        [Authorize]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await userRepository.GetUserByUserNameAsync(User.GetUserName());

            if (user == null)
            {
                return NotFound("User not found");
            }

            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);

            if (photo == null)
            {
                return NotFound("Photo not found");
            }

            // Check if the photo is already the main photo
            if (photo.IsMain)
            {
                return BadRequest("Photo is already the main photo");
            }

            // Set the current main photo to non-main
            var currentMain = user.Photos.FirstOrDefault(p => p.IsMain);

            if (currentMain != null)
            {
                currentMain.IsMain = false;
            }

            // Set the new photo as the main photo
            photo.IsMain = true;

            if (await userRepository.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Failed to set main photo");
        }

        [HttpDelete("delete-photo/{photoId}")]
        [Authorize]
        public async Task<ActionResult> DeletePhoto (int photoId)
        {
            var user = await userRepository.GetUserByUserNameAsync(User.GetUserName());
            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);
            if(photo == null)
            {
                return NotFound("no photo with " + photoId.ToString());
            }
            else if (photo.IsMain)
            {
                return BadRequest("you cant delete main photo");
            }else
            {
                if(photo.PublicId != null)
                {
                    DeletionResult DeletionResult = await this.photoService.DeletePhotoAsync(photo.PublicId);
                    if (DeletionResult != null && DeletionResult.Error != null && DeletionResult.Error.Message != null)
                    {
                        return BadRequest(DeletionResult.Error.Message);
                    }
                    else
                    {
                        user.Photos.Remove(photo);
                        if (await userRepository.SaveAllAsync())
                            return Ok();
                        return BadRequest("Faild to delete the photo");
                    }
                }
                else
                {
                    return BadRequest("the publicId is null");
                }
            }
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

    }
}
