using API.Data;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        protected  DataContext _context;
        protected IConnectionStringProvider _connectionStringProvider;

        public BaseApiController(DataContext context, IConnectionStringProvider connectionStringProvider)
        {
            _context = context;
            _connectionStringProvider = connectionStringProvider;
        }
    }
}
