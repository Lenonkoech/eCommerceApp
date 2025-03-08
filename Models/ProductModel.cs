using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace eCommerceApi.Models
{
    public class ProductModel
    {
        [Key]
        public int ProductId { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required double Price {  get; set; }
        public required string ImageUrl {  get; set; }
     //   public string? Discount { get; set; }
        public  DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [ForeignKey("Category")]
        public int CategoryId { get; set; } //FK
        [JsonIgnore]
        public CategoryModel? Category { get; set; }

    }
}
