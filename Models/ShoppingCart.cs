using System.ComponentModel.DataAnnotations;

namespace eCommerceApi.Models
{
    public class ShoppingCart
    {
        [Key]
        public required int CartItemId { get; set; }
        public required int UserId { get; set; }   //Foreigh key to userModel         
        public required int ProductId { get; set; }     //Foreigh key to ProductModel    
        public required int Quantity { get; set; }          
        public required DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }
}
