using bgmarketDB;
using bgmarketDB.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace bgmarketAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class LogSistemaController : ControllerBase
    {
        private readonly bgmarketContext _context;

        public LogSistemaController(bgmarketContext context)
        {
            _context = context;
        }

        // GET: api/logsistema?page=1&pageSize=10
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LogSistema>>> GetLogs([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                if (page <= 0) page = 1;
                if (pageSize <= 0 || pageSize > 100) pageSize = 10; // Limite maximo

                var totalItems = await _context.LogsSistema.CountAsync();

                var logs = await _context.LogsSistema
                    .Include(log => log.usuario)
                    .OrderByDescending(log => log.fechaRegistro)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                // Agregamos headers para info de paginación
                Response.Headers.Add("X-Total-Count", totalItems.ToString());
                Response.Headers.Add("X-Page", page.ToString());
                Response.Headers.Add("X-PageSize", pageSize.ToString());

                return Ok(logs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // GET: api/logsistema/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LogSistema>> GetLog(int id)
        {
            try
            {
                var log = await _context.LogsSistema
                    .Include(log => log.usuario)
                    .FirstOrDefaultAsync(l => l.Id == id);

                if (log == null)
                    return NotFound(new { message = "Registro de log no encontrado" });

                return Ok(log);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // POST: api/logsistema
        [HttpPost]
        public async Task<ActionResult<LogSistema>> CreateLog(LogSistema input)
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                if (userId == null) return Unauthorized(new { message = "Usuario no autenticado" });

                if (input == null || string.IsNullOrWhiteSpace(input.accion) || string.IsNullOrWhiteSpace(input.entidad))
                {
                    return BadRequest(new { message = "Datos incompletos para crear el log" });
                }

                var log = new LogSistema
                {
                    usuarioId = int.Parse(userId),
                    accion = input.accion,
                    entidad = input.entidad,
                    detalle = input.detalle,
                    fechaRegistro = DateTime.UtcNow,
                    ipOrigen = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "desconocida"
                };

                _context.LogsSistema.Add(log);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetLog), new { id = log.Id }, log);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }
    }
}
