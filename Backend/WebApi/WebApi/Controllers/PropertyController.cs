using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using WebApi.Interfaces;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class PropertyController : BaseController
    {
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;
        private readonly IPhotoService photoService;

        public PropertyController(IUnitOfWork uow,
                                  IMapper mapper,
                                  IPhotoService photoService
                                  )
        {
            this.photoService = photoService;
            this.uow = uow;
            this.mapper = mapper;
        }

        //property/list/1
        [HttpGet("list/{sellRent}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPropertyList(int sellRent)
        {
            var properties = await uow.PropertyRepository.GetPropertiesAsync(sellRent);
            //aca ya  uso ienumerable porque  obtendre un listado de propiedades
            var propertyListDTO = mapper.Map<IEnumerable<PropertyListDto>>(properties);
            return Ok(propertyListDTO);
        }

        //property/detail/1
        [HttpGet("detail/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPropertyDetail(int id)
        {
            var property = await uow.PropertyRepository.GetPropertyDetailAsync(id);
            //aca ya no uso ienumerable porque no obtendre un listado sino solo una propiedad
            var propertyDTO = mapper.Map<PropertyDetailDto>(property);
            return Ok(propertyDTO);
        }

        //property/add
        [HttpPost("add")]
        [Authorize]
        //[AllowAnonymous]
        public async Task<IActionResult> AddProperty(PropertyDto propertyDto)
        {
            var property = mapper.Map<Property>(propertyDto);
            var userId = GetUserId();
            property.PostedBy = userId;
            property.LastUpdatedBy = userId;
            //property.PostedBy = 2;
            //property.LastUpdatedBy = 2;
            uow.PropertyRepository.AddProperty(property);
            await uow.SaveAsync();
            return StatusCode(201);
        }

        //property/add/photo/1
        [HttpPost("add/photo/{propId}")]
        [Authorize]
        public async Task<ActionResult<PhotoDto>> AddPropertyPhoto(IFormFile file, int propId)
        {
            //metodo para guardar la foto en la nube
            var result = await photoService.UploadPhotoAsync(file);
            if (result.Error != null)
                return BadRequest(result.Error.Message);            

            //metodo para guardar en la bd
            var userId = GetUserId();

            var property = await uow.PropertyRepository.GetPropertyByIdAsync(propId);

            if (property.PostedBy != userId)
                return BadRequest("You are not authorised to upload photo for this property");

            var photo = new Photo
            {
                ImageUrl = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };
            if (property.Photos.Count == 0)
            {
                photo.IsPrimary = true;
            }

            property.Photos.Add(photo);

            //aca mapeo el dto para obtener este dto en la respuesta del json
            //como sabemos no es bueno devolver toda la entidad, basta con el dto
            //para mostrar solo los campos necesarios
            if (await uow.SaveAsync()) return mapper.Map<PhotoDto>(photo);
            //si no se grabo de manera correcta entonces devuelveme este error
            return BadRequest("Some problem occured in uploading photo..");
        }

        //aca tambien se puede usar httPut ya que es una actualizacion de datos
        //property/set-primary-photo/42/jl0sdfl20sdf2s
        [HttpPost("set-primary-photo/{propId}/{photoPublicId}")]
        [Authorize]
        public async Task<IActionResult> SetPrimaryPhoto(int propId, string photoPublicId)
        {
            //en este metodo obtengo el id del user a traves del token donde se logeo
            var userId = GetUserId();

            //obtengo la propiedad
            var property = await uow.PropertyRepository.GetPropertyByIdAsync(propId);

            //el usuario logeado no es el mismo el cual creo la propiedad
            if (property.PostedBy != userId)
                return BadRequest("You are not authorised to change the photo");

            //la propiedad no existe
            if (property == null || property.PostedBy != userId)
                return BadRequest("No such property or photo exists");

            //obtengo la foto perteneciente a la entidad propiedad
            var photo = property.Photos.FirstOrDefault(p => p.PublicId == photoPublicId);

            //la foto no existe
            if (photo == null)
                return BadRequest("No such property or photo exists");

            //la foto ya es primaria
            if (photo.IsPrimary)
                return BadRequest("This is already a primary photo");

            //de la entidad photo, donde la idproperty es 3 por el proId, buscame en la entidad photo de la idproperty 3 si tiene una foto con isPrimary true
            var currentPrimary = property.Photos.FirstOrDefault(p => p.IsPrimary);

            //si en la entidad photo, ya existe un isprimary true de una property 3, entonces setealo como false
            if (currentPrimary != null) currentPrimary.IsPrimary = false;
            //ahora de la foto qeu quiero que sea primary aca lo seteo como true
            photo.IsPrimary = true;

            //si se graba en la bd con exito entonces devuelvo un nocontent, caso contrato digo que hubo un error
            if (await uow.SaveAsync()) return NoContent();
            return BadRequest("Failed to set primary photo");
        }

        [HttpDelete("delete-photo/{propId}/{photoPublicId}")]
        [Authorize]
        public async Task<IActionResult> DeletePhoto(int propId, string photoPublicId)
        {
            //en este metodo obtengo el id del user a traves del token donde se logeo
            var userId = GetUserId();

            //obtengo la propiedad
            var property = await uow.PropertyRepository.GetPropertyByIdAsync(propId);

            //el usuario logeado no es el mismo el cual creo la propiedad
            if (property.PostedBy != userId)
                return BadRequest("You are not authorised to delete the photo");

            //la propiedad no existe
            if (property == null || property.PostedBy != userId)
                return BadRequest("No such property or photo exists");

            //obtengo la foto perteneciente a la entidad propiedad
            var photo = property.Photos.FirstOrDefault(p => p.PublicId == photoPublicId);

            //la foto no existe
            if (photo == null)
                return BadRequest("No such property or photo exists");

            //la foto ya es primaria
            if (photo.IsPrimary)
                return BadRequest("No se puede eliminar una foto principal");

            var result = await photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error != null) 
                return BadRequest(result.Error.Message);

            property.Photos.Remove(photo);

            //si se graba en la bd con exito entonces devuelvo un Ok, caso contrato digo que hubo un error
            if (await uow.SaveAsync()) return Ok();
            return BadRequest("Failed to delete photo");
        }




    }
}