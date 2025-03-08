using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eCommerceApi.Models
{
    public class OrderModel
    {
        [Key]
        public int OrderId { get; set; }
        [ForeignKey("ProductId")]
        public required int ProductId { get; set; }  //Fk
        [ForeignKey("UserId")]
        public required int UserId { get; set; } //FK 
        public required double TotalAmount { get; set; }
        public string? Status { get; set; }
        public string? DeliveryAdress { get; set; }
        public required DateTime OrderDate { get; set; } = DateTime.UtcNow;

    }
}
