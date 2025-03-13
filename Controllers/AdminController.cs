using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using eCommerceApi.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace eCommerceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AdminController> _logger;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public AdminController(ApplicationDbContext context, ILogger<AdminController> logger, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _httpClient = httpClientFactory?.CreateClient() ?? throw new ArgumentNullException(nameof(httpClientFactory));
        }

        // GET: api/Admin
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdminModel>>> GetAdmins()
        {
            return await _context.Admins.ToListAsync();
        }

        // GET: api/Admin/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AdminModel>> GetAdminModel(int id)
        {
            var adminModel = await _context.Admins.FindAsync(id);
            if (adminModel == null)
            {
                return NotFound();
            }

            return adminModel;
        }

        // PUT: api/Admin/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAdminModel(int id, AdminModel adminModel)
        {
            if (id != adminModel.AdminId)
            {
                return BadRequest();
            }

            _context.Entry(adminModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AdminModelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Admin Insecure
        //[HttpPost]
        //public async Task<ActionResult<AdminModel>> PostAdminModel(AdminModel adminModel)
        //{
        //    _context.Admins.Add(adminModel);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction(nameof(GetAdminModel), new { id = adminModel.AdminId }, adminModel);
        //}

        // DELETE: api/Admin/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdminModel(int id)
        {
            var adminModel = await _context.Admins.FindAsync(id);
            if (adminModel == null)
            {
                return NotFound();
            }

            _context.Admins.Remove(adminModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AdminModelExists(int id)
        {
            return _context.Admins.Any(e => e.AdminId == id);
        }

        // Admin Registration
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AdminModel admin)
        {
            if (admin == null)
            {
                _logger.LogWarning("Admin data is null.");
                return BadRequest("Admin data is null.");
            }

            // Check if admin email already exists
            var existingAdmin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == admin.Email);
            if (existingAdmin != null)
            {
                _logger.LogWarning("Admin with this email already exists.");
                return Conflict("Email already exists.");
            }

            // Generate password hash and salt
            CreatePasswordHash(admin.Password, out byte[] passwordHash, out byte[] passwordSalt);

            // Set the PasswordHash and PasswordSalt
            admin.PasswordHash = passwordHash;
            admin.PasswordSalt = passwordSalt;
            admin.Password = System.Text.Encoding.ASCII.GetString(passwordHash);

            try
            {
                _context.Admins.Add(admin);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Admin registered successfully!");
                return Ok("Admin registered successfully!");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while registering admin.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Admin Login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AdminLogin loginData)
        {
            if (loginData == null)
            {
                return BadRequest("Login data is null.");
            }
            
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == loginData.Email);
            if (admin == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            if (!VerifyPasswordHash(loginData.Password, admin.PasswordHash, admin.PasswordSalt))
            {
                return Unauthorized("Invalid email or password.");
            }
            string token = GenerateJwtToken(admin);

            return Ok(new { Message = "Login successful!", Token = token });
        }

        private string GenerateJwtToken(AdminModel admin)
        {
            if (admin == null)
                throw new ArgumentNullException(nameof(admin), "Admin data cannot be null.");

            var claims = new List<Claim>();
            if (!string.IsNullOrEmpty(admin.FirstName))
            {
                claims.Add(new Claim(ClaimTypes.Name, admin.FirstName));
            }
            if (!string.IsNullOrEmpty(admin.Role))
            {
                claims.Add(new Claim(ClaimTypes.Role, admin.Role));
            }
            if (!string.IsNullOrEmpty(admin.Email))
                claims.Add(new Claim(ClaimTypes.Email, admin.Email));

            if (admin.AdminId != 0)
                claims.Add(new Claim(ClaimTypes.NameIdentifier, admin.AdminId.ToString()));

            if (!claims.Any())
                throw new ArgumentException("No valid claims to generate JWT token.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            using (var hmac = new HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(storedHash);
            }
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }
    }
}
