using AutoMapper;
using WebApi.Dtos;
using WebApi.Models;

namespace WebApi.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            // el reverseMap permite mapear tambien al reverso, esto seria algo asi
            // CreateMap<CityDto, City>().ReverseMap();
            CreateMap<City, CityDto>().ReverseMap();

            CreateMap<City, CityUpdateDto>().ReverseMap();
        }
    }
}
