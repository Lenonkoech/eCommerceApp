
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace eCommerceApi.Models
{
    public class WishListModel
    {
        [Key]
        public int WishListId { get; set; }
        [ForeignKey("Product")]
        public int ProductId { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ProductModel? Product { get; set; }
        [JsonIgnore]
        public UserModel? User { get; set; }
    }
}
