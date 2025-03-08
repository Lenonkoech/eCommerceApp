using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using eCommerceApi.Models;

namespace eCommerceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ Get All Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductModel>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        // ✅ Search Products by Name or Description (Case-Insensitive)
        [HttpGet("search")]
        public async Task<IActionResult> SearchProducts([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest(new { message = "Search query cannot be empty." });
            }

            var products = await _context.Products
                .Where(p => EF.Functions.Like(p.Name, $"%{query}%") ||
                            EF.Functions.Like(p.Description, $"%{query}%"))
                .ToListAsync();

            if (!products.Any())
            {
                return NotFound(new { message = $"No products found matching '{query}'." });
            }

            return Ok(products);
        }

        // ✅ Get a Single Product by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductModel>> GetProductModel(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound(new { message = $"Product with ID {id} not found." });
            }

            return product;
        }

        // ✅ Update Product by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductModel(int id, ProductModel productModel)
        {
            if (id != productModel.ProductId)
            {
                return BadRequest(new { message = "Mismatched product ID." });
            }

            _context.Entry(productModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductModelExists(id))
                {
                    return NotFound(new { message = "Product no longer exists." });
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // ✅ Add a New Product
        [HttpPost]
        public async Task<ActionResult<ProductModel>> PostProductModel(ProductModel productModel)
        {
            _context.Products.Add(productModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductModel), new { id = productModel.ProductId }, productModel);
        }

        // ✅ Delete Product by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductModel(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ Get Products by Category with Limit
        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<ProductModel>>> GetRelatedProducts(int categoryId, [FromQuery] int limit = 8)
        {
            if (limit <= 0 || limit > 50)
            {
                return BadRequest(new { message = "Limit must be between 1 and 50." });
            }

            var products = await _context.Products
                .Where(p => p.CategoryId == categoryId)
                .OrderByDescending(p => p.Price)  // Example: Sort by price (can be adjusted)
                .Take(limit)
                .ToListAsync();

            if (!products.Any())
            {
                return NotFound(new { message = "No related products found for this category." });
            }

            return Ok(products);
        }

        private bool ProductModelExists(int id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }
    }
}
