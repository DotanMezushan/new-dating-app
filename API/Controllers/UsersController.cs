using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConnectionStringProvider _connectionStringProvider;

        public UsersController(DataContext context, IConnectionStringProvider connectionStringProvider)
        {
            _context = context;
            _connectionStringProvider = connectionStringProvider;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            // Retrieve all users asynchronously
            var users = await _context.Users.ToListAsync();

            // Return the list of users
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetUser(int Id)
        {
            var connectionString = _connectionStringProvider.GetConnectionString();
            var query = "SELECT * FROM Users WHERE Id = @Id";

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand(query, connection))
                {
                    // Add parameter to SQL command
                    command.Parameters.AddWithValue("@Id", Id);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return Ok(new AppUser
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                UserName = reader.GetString(reader.GetOrdinal("UserName"))
                                // Map other properties if necessary
                            });
                        }
                    }
                }
            }

            return null; // Or handle accordingly
        }



    }
}
