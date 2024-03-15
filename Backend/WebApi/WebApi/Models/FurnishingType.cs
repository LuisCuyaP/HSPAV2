using System.ComponentModel.DataAnnotations;

namespace WebApi.Models
{
    public class FurnishingType : BaseEntity    
    {
        //estos atributos se comentan ya que como va ser repetitivo lo heredo mejor de BaseEntity
        //public int Id { get; set; }

        [Required]
        public string Name { get; set; }
    }
}