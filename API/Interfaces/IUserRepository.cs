using API.DTOs;
using API.Entities;
using API.Utils;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        public void Update(AppUser user);
        public  Task<bool> SaveAllAsync();
        public Task<IEnumerable<AppUser>> GetUsersAsync();
        public Task<AppUser> GetUserByIdAsync(int id);
        public Task<AppUser> GetUserByUserNameAsync(string  userName);
        public Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);
        public Task<MemberDto> GetMemberByIdAsync(int id);
        public Task<MemberDto> GetMemberByUserNameAsync(string userName);
    }
}
