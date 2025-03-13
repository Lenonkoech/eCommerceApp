using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace eCommerceApi.Models
{
    public class ProductModel
    {
        [Key]
        public int ProductId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public required double Price { get; set; }
        public string? ImageUrl { get; set; } // Nullable in case no image is provided
        public double? Discount { get; set; } // Use double? for flexibility
        public int Stock { get; set; } // Changed from string to int
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("Category")]
        public int CategoryId { get; set; }

        [JsonIgnore]
        public CategoryModel? Category { get; set; }
    }
}
