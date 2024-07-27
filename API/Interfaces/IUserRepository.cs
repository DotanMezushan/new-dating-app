using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        public void Update(AppUser user);
        public  Task<bool> SaveAllAsync();
        public Task<IEnumerable<AppUser>> GetUsersAsync();
        public Task<AppUser> GetUserByIdAsync(int id);
        public Task<AppUser> GetUserByUserNameAsync(string  userName);
        public Task<List<MemberDto>> GetMembersAsync();
        public Task<MemberDto> GetMemberByIdAsync(int id);
        public Task<MemberDto> GetMemberByUserNameAsync(string userName);
    }
}
