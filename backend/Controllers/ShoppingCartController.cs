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
    public class ShoppingCartController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ShoppingCartController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ GET: All Shopping Cart Items (Including Product Details)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetShoppingCart()
        {
            var cartItems = await _context.ShoppingCart
                .Include(c => c.Product) // Fetch product details
                .Select(c => new
                {
                    c.CartItemId,
                    c.UserId,
                    c.ProductId,
                    Product = new
                    {
                        c.Product.ProductId,
                        c.Product.Name,
                        c.Product.Price,
                        c.Product.ImageUrl
                    },
                    c.Quantity,
                    c.AddedAt
                })
                .ToListAsync();

            return Ok(cartItems);
        }

        // ✅ GET: Shopping Cart by ID (With Product Details)
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetShoppingCart(int id)
        {
            var cartItem = await _context.ShoppingCart
                .Include(c => c.Product)
                .Where(c => c.CartItemId == id)
                .Select(c => new
                {
                    c.CartItemId,
                    c.UserId,
                    c.ProductId,
                    Product = new
                    {
                        c.Product.ProductId,
                        c.Product.Name,
                        c.Product.Price,
                        c.Product.ImageUrl
                    },
                    c.Quantity,
                    c.AddedAt
                })
                .FirstOrDefaultAsync();

            if (cartItem == null)
            {
                return NotFound(new { message = "Cart item not found." });
            }

            return Ok(cartItem);
        }

        // ✅ POST: Add Item to Cart (or Increase Quantity)
        [HttpPost]
        public async Task<ActionResult<ShoppingCart>> PostShoppingCart(ShoppingCart shoppingCart)
        {
            var existingCartItem = await _context.ShoppingCart
                .FirstOrDefaultAsync(c => c.UserId == shoppingCart.UserId && c.ProductId == shoppingCart.ProductId);

            if (existingCartItem != null)
            {
                existingCartItem.Quantity += shoppingCart.Quantity;
                _context.Entry(existingCartItem).State = EntityState.Modified;
            }
            else
            {
                shoppingCart.AddedAt = DateTime.UtcNow;
                _context.ShoppingCart.Add(shoppingCart);
            }

            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetShoppingCart), new { id = shoppingCart.CartItemId }, shoppingCart);
        }
        // ✅ GET: Shopping Cart by User ID (With Product Details)
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetShoppingCartByUser(int userId)
        {
            var cartItems = await _context.ShoppingCart
                .Where(c => c.UserId == userId)
                .Include(c => c.Product)
                .Select(c => new
                {
                    c.CartItemId,
                    c.UserId,
                    c.ProductId,
                    Product = new
                    {
                        c.Product.ProductId,
                        c.Product.Name,
                        c.Product.Price,
                        c.Product.ImageUrl
                    },
                    c.Quantity,
                    c.AddedAt
                })
                .ToListAsync();

            return Ok(cartItems); // Always return 200 OK with an array, even if it's empty
        }



        // ✅ PATCH: Increase Item Quantity
        [HttpPatch("increase/{cartItemId}")]
        public async Task<IActionResult> IncreaseQuantity(int cartItemId)
        {
            var cartItem = await _context.ShoppingCart.FindAsync(cartItemId);
            if (cartItem == null)
            {
                return NotFound(new { message = "Cart item not found." });
            }

            cartItem.Quantity += 1;
            await _context.SaveChangesAsync();
            return Ok(cartItem);
        }

        // ✅ PATCH: Decrease Item Quantity (Remove if Quantity = 1)
        [HttpPatch("decrease/{cartItemId}")]
        public async Task<IActionResult> DecreaseQuantity(int cartItemId)
        {
            var cartItem = await _context.ShoppingCart.FindAsync(cartItemId);
            if (cartItem == null)
            {
                return NotFound(new { message = "Cart item not found." });
            }

            if (cartItem.Quantity > 1)
            {
                cartItem.Quantity -= 1;
                await _context.SaveChangesAsync();
                return Ok(cartItem);
            }
            else
            {
                _context.ShoppingCart.Remove(cartItem);
                await _context.SaveChangesAsync();
                return NoContent();
            }
        }

        // ✅ DELETE: Remove Item from Cart
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShoppingCart(int id)
        {
            var shoppingCart = await _context.ShoppingCart.FindAsync(id);
            if (shoppingCart == null) return NotFound(new { message = "Cart item not found." });

            _context.ShoppingCart.Remove(shoppingCart);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ✅ DELETE: Clear Entire Cart for a User
        [HttpDelete("clear/{userId}")]
        public async Task<IActionResult> ClearCart(int userId)
        {
            var cartItems = _context.ShoppingCart.Where(c => c.UserId == userId);
            if (!cartItems.Any()) return NotFound(new { message = "Cart is already empty." });

            _context.ShoppingCart.RemoveRange(cartItems);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ✅ Helper: Check if Cart Item Exists
        private bool ShoppingCartExists(int id)
        {
            return _context.ShoppingCart.Any(e => e.CartItemId == id);
        }
    }
}
