using eCommerceApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Microsoft.Extensions.Logging;
using eCommerceApi.Service;

var builder = WebApplication.CreateBuilder(args);

//  Load Configuration
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

// Retrieve and validate connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found in appsettings.json.");

try
{
    //  Adding Database Context with explicit MySQL version
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseMySql(connectionString,
            new MySqlServerVersion(new Version(8, 0, 21)))); // MySQL version

    ////  Add Identity with custom UserModel
    //builder.Services.AddIdentity<UserModel, IdentityRole>(options =>
    //{
    //    options.SignIn.RequireConfirmedAccount = true;
    //    options.Password.RequireDigit = true;
    //    options.Password.RequiredLength = 8;
    //})
    //.AddEntityFrameworkStores<ApplicationDbContext>()
    ////.AddDefaultTokenProviders();

    //  Add logging, controllers, and Swagger
    builder.Services.AddLogging();
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
//Register Mpesa service
    builder.Services.AddScoped<MpesaService>();
    //  Configure Swagger with JWT Support
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo { Title = "eCommerce API", Version = "v1" });

        var securityScheme = new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Description = "Enter 'Bearer {token}'",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            Reference = new OpenApiReference
            {
                Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
            }
        };

        options.AddSecurityDefinition("Bearer", securityScheme);
        options.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            { securityScheme, new string[] { } }
        });
    });

    //  Configure CORS
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAll", policy =>
        {
            policy.WithOrigins("https://localhost:3000")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        });
    });

    //  Read JWT settings with detailed validation and logging
    var jwtSettings = builder.Configuration.GetSection("Jwt");
    var key = jwtSettings["Key"] ?? "DefaultInsecureKeyForDevelopmentOnly"; // Fallback with log
    var issuer = jwtSettings["Issuer"];
    var audience = jwtSettings["Audience"];
    var expirationMinutes = jwtSettings.GetValue<int>("ExpirationMinutes", 60);

    var logger = LoggerFactory.Create(logging => logging.AddConsole()).CreateLogger("Program");

    if (string.IsNullOrEmpty(key))
    {
        logger.LogCritical("JWT Key is missing in configuration. Using default insecure key for development only.");
        key = "DefaultInsecureKeyForDevelopmentOnly"; // Insecure fallback for dev
    }

    if (string.IsNullOrEmpty(issuer))
    {
        logger.LogCritical("JWT Issuer is missing in configuration. Using default value 'https://localhost:5294' for development.");
        issuer = "http://localhost:5294"; // Fallback
    }

    if (string.IsNullOrEmpty(audience))
    {
        logger.LogCritical("JWT Audience is missing in configuration. Using default value 'https://localhost:3000' for development.");
        audience = "http://localhost:3000"; // Fallback
    }

    logger.LogInformation("JWT Configuration - Key: {Key}, Issuer: {Issuer}, Audience: {Audience}, ExpirationMinutes: {ExpirationMinutes}",
        key, issuer, audience, expirationMinutes);

    builder.Services.AddHttpClient();

    //  Configure Authentication
    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false; // Set to true in production
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            ClockSkew = TimeSpan.Zero
        };
    })
    .AddGoogle(options =>
    {
        var googleClientId = builder.Configuration["Authentication:Google:ClientId"];
        var googleClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];

        if (string.IsNullOrEmpty(googleClientId) || string.IsNullOrEmpty(googleClientSecret))
        {
            throw new InvalidOperationException("Google authentication keys are missing in appsettings.json");
        }

        options.ClientId = googleClientId;
        options.ClientSecret = googleClientSecret;
    })
    .AddFacebook(options =>
    {
        var facebookAppId = builder.Configuration["Authentication:Facebook:AppId"];
        var facebookAppSecret = builder.Configuration["Authentication:Facebook:AppSecret"];

        if (string.IsNullOrEmpty(facebookAppId) || string.IsNullOrEmpty(facebookAppSecret))
        {
            throw new InvalidOperationException("Facebook authentication keys are missing in appsettings.json");
        }

        options.AppId = facebookAppId;
        options.AppSecret = facebookAppSecret;

    // Add services to the container
    builder.Services.Configure<MpesaConfig>(builder.Configuration.GetSection("MpesaConfig"));

    var app = builder.Build();

    // s Middleware Setup
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "eCommerce API v1");
        });
    }

    app.UseStaticFiles(); // serve static files like images
    app.UseHttpsRedirection();
    app.UseCors("AllowAll");
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    var logger = LoggerFactory.Create(logging => logging.AddConsole()).CreateLogger("Program");
    logger.LogCritical(ex, "Application failed to start: {Message}", ex.Message);
    throw;
}