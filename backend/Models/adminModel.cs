using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace eCommerceApi.Models
{
    public class AdminModel
    {
        [Key]
        public int AdminId { get; set; }

        [Required]
        public required string FirstName { get; set; }

        [Required]
        public required string LastName { get; set; }

        [Required]
        public required string UserName { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [Phone]
        public required string Phone { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [DefaultValue("Admin")]
        public string Role { get; set; } = "Admin"; 

        [Required]
      
        public required string Password { get; set; }

        [JsonIgnore]
        public byte[]? PasswordHash { get; set; }

        [JsonIgnore]
        public byte[]? PasswordSalt { get; set; }
    }
}
