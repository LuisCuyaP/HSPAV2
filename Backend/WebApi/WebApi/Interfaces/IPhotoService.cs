using System.Threading.Tasks;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace WebApi.Interfaces
{
    public interface IPhotoService
    {
         Task<ImageUploadResult> UploadPhotoAsync(IFormFile photo);

         //metodo para eliminar la foto de la nube
         Task<DeletionResult> DeletePhotoAsync(string publicId);
    }
}