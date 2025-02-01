using System.ComponentModel.DataAnnotations;

namespace eCommerceApi.Models
{
    public class OrderModel
    {
        [Key]
        public int OrderId { get; set; }
        public required int ProductId { get; set; }  //Fk
        public required int UserId { get; set; } //FK 
        public required double TotalAmount { get; set; }
        public string? Status { get; set; }
        public string? DeliveryAdress { get; set; }
        public required DateTime OrderDate { get; set; } = DateTime.UtcNow;

    }
}
