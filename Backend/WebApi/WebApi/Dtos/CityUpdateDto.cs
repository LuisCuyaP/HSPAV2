namespace WebApi.Dtos
{
    //solo queremos que se expongan los sgtes atributos de forma publica de nuestra entidad City, para eso usamos DTOS
    public class CityUpdateDto
    {        
        public string Name { get; set; }        

    }
}
