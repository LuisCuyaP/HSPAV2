
//POST api/city/add?cityname=Miami
//POST api/city/add/Miami
//[HttpPost("add")]      
//[HttpPost("add/{cityname}")]
//public async Task<IActionResult> AddCity(string cityName)
//{
//    City city = new City();
//    city.Name = cityName;
//    await dc.Cities.AddAsync(city);
//    await dc.SaveChangesAsync();
//    return Ok(city);
//}

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Interfaces;
using WebApi.Dtos;
using System;
using AutoMapper;
using System.Collections.Generic;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [Authorize]
    public class CityController : BaseController
    {
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;

        public CityController(IUnitOfWork uow, IMapper mapper) {
            this.uow = uow;
            this.mapper = mapper;
        }

        /// HTTP PUT   --> Actualizacion completa de la entidad
        /// HTTP PATCH --> Actualizacion parcial de la entidad, solo actualizo algunos atributos que necesite


        //GET api/city/
        //[AllowAnonymous] = ignora el atributo Authorize, osea no es necesario agregar el JWT en la consulta por mas que 
        //este el authorize en el controlador
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetCities()
        {
            //throw new UnauthorizedAccessException();
            var cities = await uow.CityRepository.GetCitiesAsync();

            //aca estoy mapeando CityDto
            var citiesDto = mapper.Map<IEnumerable<CityDto>>(cities);

            //var citiesDto = from c in cities
            //                select new CityDto()
            //                {
            //                    Id = c.Id,
            //                    Name = c.Name                              
            //                };
             
            return Ok(citiesDto);
        }
       
        //POST api/city/post   --la info para agregar es con un json en el body
        [HttpPost("post")]
        public async Task<IActionResult> AddCity(CityDto cityDto)
        {
            //var city = new City
            //{
            //    Name = cityDto.Name,
            //    LastUpdateBy = 1,
            //    LastUpdatedOn = DateTime.Now,
            //};

            //aca estoy mapeando City por ello en AutomaMapperProfiles pongo reverseMap

            //if (!ModelState.IsValid)
            //    return BadRequest(ModelState);
            
            var city = mapper.Map<City>(cityDto);
            city.LastUpdatedBy = 1;
            city.LastUpdatedOn = DateTime.Now;


            uow.CityRepository.AddCity(city);
            await uow.SaveAsync();
            //return Ok(city);
            return StatusCode(201);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateCity(int id, CityDto cityDto)
        {
            //try
            //{
                if (id != cityDto.Id)
                    return BadRequest("Update not allowed");
                //como es un update debo mapear con la info que saco de la bd, por eso se mapea con el cityFromDb
                //si en el cuerpo no especifico todos los atributos lo seteare el update con un null, por ejemplo si no mando el Name que pertenece al CityDto lo seteare nullo
                var cityFromDb = await uow.CityRepository.FindCity(id);
                if (cityFromDb == null)
                    return BadRequest("Update not allowed");

                cityFromDb.LastUpdatedBy = 1;
                cityFromDb.LastUpdatedOn = DateTime.Now;
                mapper.Map(cityDto, cityFromDb);

                throw new Exception("Some unknown error ocurred");
                await uow.SaveAsync();
                return StatusCode(200);
            //}
            //catch (Exception e)
            //{
            //    return StatusCode(500, "Some unknown error ocurred");
            //}

            
        }


        [HttpPut("updateCityName/{id}")]
        public async Task<IActionResult> UpdateCity(int id, CityUpdateDto cityUpdateDto)
        {
            //como es un update debo mapear con la info que saco de la bd, por eso se mapea con el cityFromDb
            //si en el cuerpo no especifico todos los atributos lo seteare el update con un null, por ejemplo en esta entidad solo hay name entonce solo mando el name y lo seteara pero como en la entidad
            //no hay country no le afectara el udate
            var cityFromDb = await uow.CityRepository.FindCity(id);
            cityFromDb.LastUpdatedBy = 1;
            cityFromDb.LastUpdatedOn = DateTime.Now;

            mapper.Map(cityUpdateDto, cityFromDb);
            await uow.SaveAsync();
            return StatusCode(200);
        }


        [HttpPatch("update/{id}")]
        public async Task<IActionResult> UpdateCityPath(int id, JsonPatchDocument<City> cityToPath)
        {
            var cityFromDb = await uow.CityRepository.FindCity(id);
            cityFromDb.LastUpdatedBy = 1;
            cityFromDb.LastUpdatedOn = DateTime.Now;

            cityToPath.ApplyTo(cityFromDb, ModelState);            
            await uow.SaveAsync();
            return StatusCode(200);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteCity(int id)
        {
            uow.CityRepository.DeleteCity(id);
            await uow.SaveAsync();
            return Ok(id);
        }


    }
}
