using System.ComponentModel.DataAnnotations;

namespace eCommerceApi.Models
{
    public class CartItem
    {
        [Key]
        public int CartItemId { get; set; }
        public required int UserId {  get; set; } //FK
        public required int ProductId {  get; set; } //FK
        public required int Quantity {  get; set; }
        public required DateTime AddedAt { get; set; } = DateTime.UtcNow;

    }
}
