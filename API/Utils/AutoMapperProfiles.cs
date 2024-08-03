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
            CreateMap<MemberUpdateDto, AppUser>()
                .ForMember(dest => dest.Introduction, opt => opt.MapFrom(src => src.Introduction))
                .ForMember(dest => dest.LookingFor, opt => opt.MapFrom(src => src.LookingFor))
                .ForMember(dest => dest.Interests, opt => opt.MapFrom(src => src.Interests))
                .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.City))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Country));
            CreateMap<RegisterDto, AppUser>();
        }
    }
}
//.ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src =>
//    src.Photos.FirstOrDefault(photo => photo.IsMain).Url))
//.ForMember(dest => dest.Photos, opt => opt.MapFrom(src => src.Photos));
