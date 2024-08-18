using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class Group
    {
        public Group()
        {
            
        }
        public Group(string name)
        {
            Name = name;
        }
        [Key]// to make it pk in db and it make it index
        public string Name { get; set; }
        public ICollection<Connection> Connection { get; set; } = new List<Connection>();
    }
}
