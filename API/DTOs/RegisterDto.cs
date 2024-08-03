using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required] public string UserName { get; set; }
        [Required] [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }
        [Required] public DateTime DateOfBirth { get; set; }
        [Required] public string KnowAs { get; set; }
        [Required] public string City { get; set; }
        [Required] public string Country { get; set; }
        [Required] public string Gender { get; set; }

    }
}
