using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using eCommerceApi.Models;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Security.Claims;
using System.Text.Json;
using NuGet.Protocol.Plugins;


namespace eCommerceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UserController> _logger;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public UserController(ApplicationDbContext context, ILogger<UserController> logger, IHttpClientFactory httpClientFactory, IConfiguration configuration
            )
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _httpClient = httpClientFactory?.CreateClient() ?? throw new ArgumentNullException(nameof(httpClientFactory));
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserModel>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserModel>> GetUserModel(int id)
        {
            var userModel = await _context.Users.FindAsync(id);

            if (userModel == null)
            {
                return NotFound();
            }

            return userModel;
        }

        // PUT: api/User/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserModel(int id, UserModel userModel)
        {
            if (id != userModel.UserId)
            {
                return BadRequest();
            }

            _context.Entry(userModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserModelExists(id))
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

        // POST: api/User
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserModel>> PostUserModel(UserModel userModel)
        {
            _context.Users.Add(userModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUserModel", new { id = userModel.UserId }, userModel);
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserModel(int id)
        {
            var userModel = await _context.Users.FindAsync(id);
            if (userModel == null)
            {
                return NotFound();
            }

            _context.Users.Remove(userModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserModelExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }
        // POST: api/User/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserModel user)
        {
            if (user == null)
            {
                _logger.LogWarning("User data is null.");
                return BadRequest("User data is null.");
            }

            // Check if username already exists
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser != null)
            {
                _logger.LogWarning("User with this email already exists.");
                return Conflict("Email already exists.");
            }

            // Generate password hash and salt
            CreatePasswordHash(user.Password, out byte[] passwordHash, out byte[] passwordSalt);

            // Set the PasswordHash and PasswordSalt
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.Password = System.Text.Encoding.ASCII.GetString(passwordHash);

            try
            {
                // Add the user to the database
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("User registered successfully!");
                return Ok("User registered successfully!");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while registering user.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        // POST: api/User/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginData)
        {
            if (loginData == null)
            {
                return BadRequest("Login data is null.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginData.Email);
            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            if (!VerifyPasswordHash(loginData.Password, user.PasswordHash, user.PasswordSalt))
            {
                return Unauthorized("Invalid email or password.");
            }
            string token = GenerateJwtToken(user);

            // At this point, the user is authenticated successfully
            return Ok (new{ Message="Login successful!", Token=token});
        }

        private string GenerateJwtToken(UserModel user)
        {
            if (user == null)
               throw new ArgumentNullException(nameof(user), "User data cannot be null.");

            var claims = new List<Claim>();
            if (!string.IsNullOrEmpty(user.FirstName))  // Ensure userData is not null
            {
                claims.Add(new Claim(ClaimTypes.Name, user.FirstName)); // Use '!' to avoid warnings
            }


            if (!string.IsNullOrEmpty(user.Email))
                claims.Add(new Claim(ClaimTypes.Email, user.Email));

            if (user.UserId != 0)
                claims.Add(new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()));

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
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(storedHash);
            }
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }


        // Google Login
        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] ExternalLoginRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.AccessToken))
            {
                return BadRequest(new { Message = "Access token is required." });
            }

            var userData = await ValidateGoogleToken(request.AccessToken);
            if (userData == null || string.IsNullOrEmpty(userData.Email))
            {
                return BadRequest(new { Message = "Failed to retrieve Google user data." });
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == userData.Email);

            if (existingUser == null)
            {
                return Unauthorized(new { Message = "User with this email not found. Please Sign up.", RequiresRegistration = true });
            }

            var jwtToken = GenerateJwtToken(existingUser);

            return Ok(new
            {
                Token = jwtToken,
                User = new
                {
                    existingUser.UserId,
                    existingUser.FirstName,
                    existingUser.Email
                }
            });
        }

        private async Task<ExternalUserData> ValidateGoogleToken(string accessToken)
        {
            var googleApiUrl = $"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={accessToken}";
            var response = await _httpClient.GetAsync(googleApiUrl);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }
            var content = await response.Content.ReadAsStringAsync();
            _logger.LogInformation($"JWT Key Length: {Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]).Length} bytes");
            return JsonConvert.DeserializeObject<ExternalUserData>(content);
        }
        // Facebook login
        [HttpPost("facebook-login")]

        public async Task<IActionResult> FacebookLogin([FromBody] ExternalLoginRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.AccessToken))
            {
                return BadRequest(new { Message = "Access token is required." });
            }

            var userData = await GetFacebookUserDataAsync(request.AccessToken);
            if (userData == null || string.IsNullOrEmpty(userData.Email))
            {
                return BadRequest(new { Message = "Failed to retrieve Facebook user data." });
            }

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == userData.Email);

            if (existingUser == null)
            {
                return Unauthorized(new { Message = "User with this email not found. Please Sign up.", RequiresRegistration = true });
            }

            var jwtToken = GenerateJwtToken(existingUser); // ✅ Pass the full UserModel object

            return Ok(new
            {
                Token = jwtToken,
                User = new
                {
                    existingUser.UserId,
                    existingUser.FirstName,
                    existingUser.Email
                }
            });
        }

        private async Task<ExternalUserData> GetFacebookUserDataAsync(string accessToken)
        {
            var facebookApiUrl = $"https://graph.facebook.com/me?fields=id,first_name,last_name,email&access_token={accessToken}";
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var response = await _httpClient.GetAsync(facebookApiUrl);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }
            var content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<ExternalUserData>(content);
        }

        private string GenerateJwtToken(ExternalUserData userData)
        {
            if (userData == null)
                throw new ArgumentNullException(nameof(userData), "User data cannot be null.");

            var claims = new List<Claim>();
            if (userData.UserId != 0)
                claims.Add(new Claim(ClaimTypes.NameIdentifier, userData.UserId.ToString()));

            if (!string.IsNullOrEmpty(userData.FirstName))  // Ensure userData is not null
            {
                claims.Add(new Claim(ClaimTypes.Name, userData.FirstName)); // Use '!' to avoid warnings
            }


            if (!string.IsNullOrEmpty(userData.Email))
                claims.Add(new Claim(ClaimTypes.Email, userData.Email));

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


        public class ExternalLoginRequest
        {
            public int Id { get; set; }
            public string AccessToken { get; set; }
            public string Email { get; set; }
        }

        public class ExternalUserData
        {
            public int UserId { get; set; }
            public string Email { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
        }

    }
}