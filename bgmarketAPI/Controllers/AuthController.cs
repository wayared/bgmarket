using bgmarketAPI.Helpers;
using bgmarketDB;
using bgmarketDB.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace bgmarketAPI.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly bgmarketContext _context;
        private readonly IConfiguration _config;

        public AuthController(bgmarketContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            try
            {
                if (model == null || string.IsNullOrWhiteSpace(model.Username) || string.IsNullOrWhiteSpace(model.Password))
                {
                    return BadRequest(new { message = "Usuario y contraseña son requeridos" });
                }

                var user = _context.Usuarios.FirstOrDefault(u => u.usuario == model.Username);

                if (user == null || !PasswordHelper.VerifyPassword(user.password, model.Password))
                {
                    return Unauthorized(new { message = "Usuario o contraseña inválidos" });
                }

                var token = GenerateJwtToken(user);
                return Ok(new { token });
            }
            catch (Exception ex)
            {
                // Aquí puedes agregar logging si usas alguna librería como Serilog, NLog, etc.
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        private string GenerateJwtToken(Usuario user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.usuario),
                new Claim(ClaimTypes.Role, user.rol),     // Para backend
                new Claim("rol", user.rol),               // Para frontend
                new Claim("id", user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
