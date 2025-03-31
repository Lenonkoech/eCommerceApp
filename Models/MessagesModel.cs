using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class MessagesModel
{
    [Key]
    public int QueryId { get; set; }
    [ForeignKey("userId")]
    public required int UserId { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public string? Message { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
