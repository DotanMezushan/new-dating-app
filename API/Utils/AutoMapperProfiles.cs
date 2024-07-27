using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Utils
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src =>
                src.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<Photo, PhotoDto>();

        }
    }
}
//.ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src =>
//    src.Photos.FirstOrDefault(photo => photo.IsMain).Url))
//.ForMember(dest => dest.Photos, opt => opt.MapFrom(src => src.Photos));
