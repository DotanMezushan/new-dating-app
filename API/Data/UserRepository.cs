using API.DTOs;
using API.Entities;
using API.Interfaces;
using API.Utils;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext context;
        private readonly IMapper mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<MemberDto> GetMemberByIdAsync(int id)
        {
            return await this.context.Users
                .Where(x => x.Id == id)
                .ProjectTo<MemberDto>(this.mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
        }

        public async Task<MemberDto> GetMemberByUserNameAsync(string userName)
        {
             return await this.context.Users
                  .Where(x => x.UserName == userName)
                  .ProjectTo<MemberDto>(this.mapper.ConfigurationProvider)
                  .SingleOrDefaultAsync();

        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            try
            {
                var query = context.Users.AsQueryable();
                query = query.Where(u => u.UserName != userParams.CurrentUserName);
                query = query.Where(u => u.Gender == userParams.Gender);

                var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1).ToUniversalTime();
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge).ToUniversalTime();
                query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);

                query = userParams.OrderBy switch
                {
                    "created" => query.OrderByDescending(u => u.Created.ToUniversalTime()),
                    _ => query.OrderByDescending(u => u.LastActive.ToUniversalTime())
                };

                return await PagedList<MemberDto>.CreateAsync(
                    query.ProjectTo<MemberDto>(this.mapper.ConfigurationProvider)
                    , userParams.PageNumber, userParams.PageSize);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUserNameAsync(string userName)
        {
            return await context.Users.Include(p => p.Photos).SingleOrDefaultAsync(user => user.UserName == userName);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await context.Users.ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            try
            {
                return await context.SaveChangesAsync() > 0;

            }
            catch (Exception ex)
            {
                return false;
            }
            
        }

        public void Update(AppUser user)
        {
            context.Entry(user).State= EntityState.Modified;
        }
    }
}
