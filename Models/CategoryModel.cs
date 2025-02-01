using System;
using System.ComponentModel.DataAnnotations;

namespace eCommerceApi.Models
{
    public class CategoryModel
    {
        [Key]
        public int CategoryId { get; set; } 
        public required string CategoryName { get; set; } 
        public required DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
