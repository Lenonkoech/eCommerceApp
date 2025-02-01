using System.ComponentModel.DataAnnotations;

namespace eCommerceApi.Models
{
    public class ProductModel
    {
        [Key]
        public int ProductId { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required int CategoryId { get; set; } //FK
        public required double Price {  get; set; }
        public required string ImageUrl {  get; set; }
        public required DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
