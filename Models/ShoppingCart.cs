using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace eCommerceApi.Models
{
    public class ShoppingCart
    {
        [Key]
        public int CartItemId { get; set; }

        public int UserId { get; set; }  // FK to User Model
        [ForeignKey("ProductId")]
        public int ProductId { get; set; }  // FK to Product Model

        [Required]
        public int Quantity { get; set; }

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        // ✅ Navigation Property
        [JsonIgnore]
        public ProductModel? Product { get; set; }
    }
}
