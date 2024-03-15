using System.ComponentModel.DataAnnotations;

namespace WebApi.Models
{
    public class PropertyType : BaseEntity
    {
        //public int Id { get; set; }

        [Required]
        public string Name { get; set; }
    }
}
