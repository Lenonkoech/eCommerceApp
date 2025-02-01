namespace eCommerceApi.DTOs
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required double Price {  get; set; }
        public required string ImageUrl {  get; set; }
    }
}
