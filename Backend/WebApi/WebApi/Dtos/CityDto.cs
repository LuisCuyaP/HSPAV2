using System.ComponentModel.DataAnnotations;

namespace WebApi.Dtos
{
    //solo queremos que se expongan los sgtes atributos de forma publica de nuestra entidad City, para eso usamos DTOS
    public class CityDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is mandatory field")]
        [StringLength(50, MinimumLength = 2)]
        [RegularExpression(".*[a-zA-Z]+.*", ErrorMessage = "Solo los numeros no estan permitidos")]
        public string Name { get; set; }

        [Required]
        public string Country { get; set; }

    }
}
