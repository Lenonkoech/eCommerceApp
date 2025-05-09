using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace eCommerceApi.Models
{
    public class CategoryModel
    {
        [Key]
        public int CategoryId { get; set; } 
        public required string CategoryName { get; set; } 
        public required DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        //[JsonIgnore]
        //public ICollection<ProductModel> Products? { get; set; }
    }
}
