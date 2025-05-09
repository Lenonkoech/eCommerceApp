using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using eCommerceApi.Models;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;

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

        // ✅ Get All Products with limit option
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductModel>>> GetProducts([FromQuery] int? limit)
        {
            IQueryable<ProductModel> query = _context.Products.OrderByDescending(p => p.ProductId);

            if (limit.HasValue && limit.Value > 0)
            {
                query = query.Take(limit.Value); // Apply the limit
            }

            var products = await query.ToListAsync();

            return Ok(products);
        }


        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<object>> GetProductsByCategory(
            int categoryId,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 16,
            [FromQuery] string? search = "")
        {
            if (page < 1 || limit <= 0 || limit > 50)
            {
                return BadRequest(new { message = "Invalid pagination parameters." });
            }

            var query = _context.Products.Where(p => p.CategoryId == categoryId);

            // Apply search filter
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.Contains(search) || p.Description.Contains(search));
            }

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)limit);

            var products = await query
                .OrderByDescending(p => p.Price)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            // Return a structured object instead of an array
            return Ok(new { products, totalPages });
        }

        [HttpGet("all")]
        public IActionResult GetAllProducts(int page = 1, int limit = 16, string search = "")
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => p.Name.Contains(search) || p.Description.Contains(search));
            }

            var products = query
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToList();

            return Ok(new { products = products, total = query.Count() });
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
        //Update products detailss
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductModel updatedProduct, IFormFile? image)
        {
            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            // Update only provided fields
            if (!string.IsNullOrEmpty(updatedProduct.Name)) existingProduct.Name = updatedProduct.Name;
            if (updatedProduct.Price != 0) existingProduct.Price = updatedProduct.Price;
            if (updatedProduct.Stock != 0) existingProduct.Stock = updatedProduct.Stock;
            if (updatedProduct.CategoryId != 0) existingProduct.CategoryId = updatedProduct.CategoryId;
            if (!string.IsNullOrEmpty(updatedProduct.Description)) existingProduct.Description = updatedProduct.Description;

            // Handle new image upload if provided
            if (image != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + image.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                existingProduct.ImageUrl = "/images/" + uniqueFileName; // Update image path
            }

            _context.Entry(existingProduct).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, new { message = "Error updating product." });
            }

            return NoContent();
        }



        [HttpPost]
        public async Task<IActionResult> PostProductModel([FromForm] ProductModel productModel, IFormFile image)
        {
            if (image != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                Directory.CreateDirectory(uploadsFolder); // Ensure the directory exists

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + image.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                productModel.ImageUrl = "/images/" + uniqueFileName; 
            }

            _context.Products.Add(productModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductModel), new { id = productModel.ProductId }, productModel);
        }


        // Delete Product by ID (Including Image)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductModel(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            // Delete the product image if it exists
            if (!string.IsNullOrEmpty(product.ImageUrl))
            {
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", product.ImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("offers")]
        public async Task<ActionResult<IEnumerable<ProductModel>>> GetOfferProducts()
        {
            var offerProducts = await _context.Products.
                Where(p => p.Discount != null)
                .ToListAsync();

            //if (!offerProducts.Any())
            //{
            //    return NotFound(new { message = "No prodcuts on Discount offer found." });
            //}
            return Ok(offerProducts);
        }

        private bool ProductModelExists(int id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }
    }
}
