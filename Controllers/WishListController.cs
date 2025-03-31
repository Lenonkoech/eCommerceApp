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
    public class WishListController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WishListController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/WishList/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetUserWishlist(int userId)
        {
            var wishlistItems = await _context.WishList
                .Where(w => w.UserId == userId)
                .Select(w => new
                {
                    w.WishListId,
                    w.ProductId
                })
                .ToListAsync();

            if (wishlistItems == null || wishlistItems.Count == 0)
            {
                return NotFound("No wishlist items found for this user.");
            }

            return Ok(wishlistItems);
        }

        // GET: api/WishList/details/user/{userId}
        [HttpGet("details/user/{userId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetUserWishlistWithProductDetails(int userId)
        {
            var wishlistItems = await _context.WishList
                .Where(w => w.UserId == userId)
                .Join(_context.Products,
                      wishlist => wishlist.ProductId,
                      product => product.ProductId,
                      (wishlist, product) => new
                      {
                          wishlist.WishListId,
                          wishlist.UserId,
                          Product = new
                          {
                              product.ProductId,
                              product.Name,
                              product.Description,
                              product.Price,
                              product.ImageUrl
                          }
                      })
                .ToListAsync();

            if (wishlistItems == null || wishlistItems.Count == 0)
            {
                return NotFound("No wishlist items found for this user.");
            }

            return Ok(wishlistItems);
        }

        // POST: api/WishList
        [HttpPost]
        public async Task<ActionResult<WishListModel>> AddToWishlist(WishListModel wishListModel)
        {
            var existingItem = await _context.WishList
                .FirstOrDefaultAsync(w => w.UserId == wishListModel.UserId && w.ProductId == wishListModel.ProductId);

            if (existingItem != null)
            {
                return BadRequest("Item is already in the wishlist.");
            }

            _context.WishList.Add(wishListModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserWishlist), new { userId = wishListModel.UserId }, wishListModel);
        }

        // DELETE: api/WishList/{wishlistId}
        [HttpDelete("{wishlistId}")]
        public async Task<IActionResult> RemoveFromWishlist(int wishlistId)
        {
            var wishListModel = await _context.WishList.FindAsync(wishlistId);
            if (wishListModel == null)
            {
                return NotFound("Wishlist item not found.");
            }

            _context.WishList.Remove(wishListModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WishListModelExists(int id)
        {
            return _context.WishList.Any(e => e.WishListId == id);
        }
    }
}
