using System;
using System.ComponentModel.DataAnnotations;

namespace WebApi.Models
{
    public class City : BaseEntity
    {
        //estos atributos se comentan ya que como va ser repetitivo lo heredo mejor de BaseEntity
        //public int Id { get; set; }
        public string Name { get; set; }

        [Required]
        public string Country { get; set; }

        //estos atributos se comentan ya que como va ser repetitivo lo heredo mejor de BaseEntity
        //public DateTime LastUpdatedOn { get; set; }

        //public int LastUpdateBy { get; set; }
    }
}
