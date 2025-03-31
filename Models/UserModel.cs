using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace eCommerceApi.Models
{
    public class UserModel
    {
        [Key]
        public int UserId { get; set; }
        [Required]
        public string FirstName { get; set; }

        [Required]
        public required string LastName { get; set; }

        [Required]
        public string Email { get; set; }

        public string? Phone { get; set; }
        public string? Location { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        //[JsonIgnore]
        [Required]
        public required string Password { get; set; }

        [JsonIgnore]
        public byte[]? PasswordHash { get; set; }

        [JsonIgnore]
        public byte[]? PasswordSalt { get; set; }
    }
}
