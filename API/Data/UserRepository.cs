using API.DTOs;
using API.Entities;
using API.Interfaces;
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

        public async Task<List<MemberDto>> GetMembersAsync()
        {
            return await this.context.Users
                .ProjectTo<MemberDto>(this.mapper.ConfigurationProvider)
                .ToListAsync();
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
            return await context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            context.Entry(user).State= EntityState.Modified;
        }
    }
}
