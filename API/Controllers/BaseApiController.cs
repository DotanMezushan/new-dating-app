using API.Data;
using API.Interfaces;
using API.Utils;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        protected  DataContext _context;
        protected IConnectionStringProvider _connectionStringProvider;
        protected IMapper _mapper;

        public BaseApiController( IConnectionStringProvider connectionStringProvider)
        {
            _connectionStringProvider = connectionStringProvider;
        }

        public BaseApiController(DataContext context, IConnectionStringProvider connectionStringProvider)
        {
            _context = context;
            _connectionStringProvider = connectionStringProvider;
        }

        public BaseApiController(DataContext context, IConnectionStringProvider connectionStringProvider, IMapper mapper)
        {
            _context = context;
            _connectionStringProvider = connectionStringProvider;
            this._mapper = mapper;
        }
    }
}
