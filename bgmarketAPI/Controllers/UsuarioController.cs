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

        // GET: api/usuario
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            return await _context.Usuarios.ToListAsync();
        }

        // GET: api/usuario/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null) return NotFound();

            return Ok(usuario);
        }

        // POST: api/usuario (signup o creación desde admin)
        [HttpPost]
        public async Task<ActionResult<Usuario>> CreateUsuario(Usuario usuario)
        {
            if (await _context.Usuarios.AnyAsync(u => u.usuario == usuario.usuario))
            {
                return BadRequest(new { message = "El nombre de usuario ya existe" });
            }

            usuario.rol = usuario.rol?.ToLower() ?? "cliente"; // Por defecto cliente
            usuario.password = PasswordHelper.HashPassword(usuario.password);
            usuario.fechaCreacion = DateTime.UtcNow;
            usuario.Activo = true;


            _context.Usuarios.Add(usuario);

            // Registrar log (si ya hay token activo)
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

        // PUT: api/usuario/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUsuario(int id, Usuario usuario)
        {
            if (id != usuario.Id) return BadRequest();

            var existing = await _context.Usuarios.FindAsync(id);
            if (existing == null) return NotFound();

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

        // DELETE: api/usuario/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null) return NotFound();

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
    }
}
