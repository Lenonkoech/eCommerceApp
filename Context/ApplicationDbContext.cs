using eCommerceApi.Models;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : base(options)
    { }

    public DbSet<UserModel> Users { get; set; }
    public DbSet<ProductModel> Products { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<OrderModel> Orders { get; set; }
    public DbSet<CategoryModel> Categories { get; set; }

public DbSet<eCommerceApi.Models.ShoppingCart> ShoppingCart { get; set; } = default!;
}