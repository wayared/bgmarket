using bgmarketAPI.Helpers;
using bgmarketDB;
using bgmarketDB.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace bgmarketAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly bgmarketContext _context;

        public UsuarioController(bgmarketContext context)
        {
            _context = context;
        }

        // GET: api/usuario?page=1&pageSize=10
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                if (page <= 0) page = 1;
                if (pageSize <= 0 || pageSize > 100) pageSize = 10;

                var totalItems = await _context.Usuarios.CountAsync();

                var usuarios = await _context.Usuarios
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                Response.Headers.Add("X-Total-Count", totalItems.ToString());
                Response.Headers.Add("X-Page", page.ToString());
                Response.Headers.Add("X-PageSize", pageSize.ToString());

                return Ok(usuarios);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // GET: api/usuario/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            try
            {
                var usuario = await _context.Usuarios.FindAsync(id);
                if (usuario == null)
                    return NotFound(new { message = "Usuario no encontrado" });

                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // POST: api/usuario
        [HttpPost]
        public async Task<ActionResult<Usuario>> CreateUsuario(Usuario usuario)
        {
            try
            {
                if (usuario == null || string.IsNullOrWhiteSpace(usuario.usuario) || string.IsNullOrWhiteSpace(usuario.password))
                    return BadRequest(new { message = "Datos inválidos para crear usuario" });

                var exists = await _context.Usuarios.AnyAsync(u => u.usuario == usuario.usuario);
                if (exists)
                    return BadRequest(new { message = "El nombre de usuario ya existe" });

                usuario.rol = usuario.rol?.ToLower() ?? "cliente"; // Por defecto cliente
                usuario.password = PasswordHelper.HashPassword(usuario.password);
                usuario.fechaCreacion = DateTime.UtcNow;
                usuario.Activo = true;

                _context.Usuarios.Add(usuario);

                if (User.Identity != null && User.Identity.IsAuthenticated)
                {
                    _context.LogsSistema.Add(LogHelper.CrearLog(
                        HttpContext,
                        "CREAR",
                        "Usuario",
                        $"Usuario '{usuario.usuario}' creado por un administrador."
                    ));
                }

                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUsuario), new { id = usuario.Id }, usuario);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // PUT: api/usuario/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUsuario(int id, Usuario usuario)
        {
            try
            {
                if (id != usuario.Id)
                    return BadRequest(new { message = "El ID no coincide con el usuario proporcionado" });

                var existing = await _context.Usuarios.FindAsync(id);
                if (existing == null)
                    return NotFound(new { message = "Usuario no encontrado" });

                existing.nombre = usuario.nombre;
                existing.apellido = usuario.apellido;
                existing.email = usuario.email;
                existing.rol = usuario.rol;
                existing.usuario = usuario.usuario;
                existing.Activo = usuario.Activo;

                _context.LogsSistema.Add(LogHelper.CrearLog(
                    HttpContext,
                    "ACTUALIZAR",
                    "Usuario",
                    $"Usuario ID {id} actualizado."
                ));

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // DELETE: api/usuario/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            try
            {
                var usuario = await _context.Usuarios.FindAsync(id);
                if (usuario == null)
                    return NotFound(new { message = "Usuario no encontrado" });

                _context.Usuarios.Remove(usuario);

                _context.LogsSistema.Add(LogHelper.CrearLog(
                    HttpContext,
                    "ELIMINAR",
                    "Usuario",
                    $"Usuario ID {id} eliminado."
                ));

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }
    }
}
