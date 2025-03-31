namespace eCommerceApi.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    namespace eCommerceApi.Models
    {
        public class MpesaTransaction
        {
            [Key]
            public int Id { get; set; }
            public string MpesaReceiptNumber { get; set; }
            public string PhoneNumber { get; set; }
            public double Amount { get; set; }
            public string Status { get; set; } 
            public DateTime TransactionDate { get; set; }
            public string CheckoutRequestId { get; set; }
            [ForeignKey("OrderId")]
            public string OrderId { get; set; } 
        }
    }

}
