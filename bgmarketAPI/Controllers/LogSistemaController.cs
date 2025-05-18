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

        // GET: api/logsistema
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LogSistema>>> GetLogs()
        {
            return await _context.LogsSistema
                .Include(log => log.usuario)
                .OrderByDescending(log => log.fechaRegistro)
                .ToListAsync();
        }

        // GET: api/logsistema/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LogSistema>> GetLog(int id)
        {
            var log = await _context.LogsSistema
                .Include(log => log.usuario)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (log == null)
                return NotFound();

            return log;
        }

        // (Opcional) POST: api/logsistema – por si se desea registrar eventos manualmente
        [HttpPost]
        public async Task<ActionResult<LogSistema>> CreateLog(LogSistema input)
        {
            var userId = User.FindFirst("id")?.Value;
            if (userId == null) return Unauthorized();

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
    }
}
