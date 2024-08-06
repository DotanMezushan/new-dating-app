using API.DTOs;
using API.Entities;
using API.Interfaces;
using API.Utils;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace API.Data
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext context;
        private readonly IMapper mapper;

        public LikesRepository(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }


        public async Task<UserLike> GetUserLike(int sourceUserId, int likeUserId)
        {
            return await context.Likes.FindAsync(sourceUserId, likeUserId);
        }

        public async Task<PagedList<LikeDto>> GetUserLikes(LikeParams likeParams)
        {
            var users = context.Users.OrderBy(u => u .UserName).AsQueryable();
            var likes = context.Likes.AsQueryable();

            if (likeParams.Predicate.ToLower() == "liked".ToLower())
            {
                likes = likes.Where(like => like.SourceUserId== likeParams.UserId);
                users = likes.Select(like => like.LikedUsers);
            }

            if(likeParams.Predicate.ToLower() == "likeBy".ToLower())
            {
                likes = likes.Where(like => like.LikedUserId == likeParams.UserId);
                users = likes.Select(like => like.SourceUser);
            }

            var likedUsers = users.Select(user => new LikeDto()
            {
                id = user.Id,
                UserName = user.UserName,
                knowAs = user.KnowAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
                City = user.City,
                Country = user.Country,
            });
            return await PagedList<LikeDto>.CreateAsync(
               likedUsers, likeParams.PageNumber, likeParams.PageSize);
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await context.Users
                .Include(x => x.LikedUsers)
                .FirstOrDefaultAsync(x => x.Id == userId);
        }
    }
}
