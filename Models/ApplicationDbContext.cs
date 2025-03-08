using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using eCommerceApi.Models;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }
    public DbSet<UserModel> Users { get; set; }
    public DbSet<ProductModel> Products { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<OrderModel> Orders { get; set; }
    public DbSet<CategoryModel> Categories { get; set; }
    public DbSet<ShoppingCart> ShoppingCart { get; set; } // Pluralized
    public DbSet<AdminModel> Admins { get; set; }


}
