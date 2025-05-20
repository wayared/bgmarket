using bgmarketAPI.Helpers;
using bgmarketDB;
using bgmarketDB.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace bgmarketAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LoteController : ControllerBase
    {
        private readonly bgmarketContext _context;

        public LoteController(bgmarketContext context)
        {
            _context = context;
        }

        // GET: api/lote?page=1&pageSize=10
       
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Lote>>> GetLotes([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                if (page <= 0) page = 1;
                if (pageSize <= 0 || pageSize > 100) pageSize = 10;

                var totalItems = await _context.Lotes.CountAsync();

                var lotes = await _context.Lotes
                    .Include(l => l.Producto)
                    .Include(l => l.UsuarioIngreso)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                Response.Headers.Add("X-Total-Count", totalItems.ToString());
                Response.Headers.Add("X-Page", page.ToString());
                Response.Headers.Add("X-PageSize", pageSize.ToString());

                return Ok(lotes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // GET: api/lote/5
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Lote>> GetLote(int id)
        {
            try
            {
                var lote = await _context.Lotes
                    .Include(l => l.Producto)
                    .Include(l => l.UsuarioIngreso)
                    .FirstOrDefaultAsync(l => l.Id == id);

                if (lote == null)
                    return NotFound(new { message = "Lote no encontrado" });

                return Ok(lote);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // POST: api/lote
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Lote>> CreateLote(Lote lote)
        {
            try
            {
                if (lote == null || string.IsNullOrWhiteSpace(lote.numeroLote))
                    return BadRequest(new { message = "Datos inválidos para el lote" });

                var duplicado = await _context.Lotes.AnyAsync(l =>
                    l.numeroLote.ToLower() == lote.numeroLote.ToLower() &&
                    l.productoId == lote.productoId);

                if (duplicado)
                {
                    return BadRequest(new { message = "Ya existe un lote con ese número para este producto." });
                }

                lote.fechaIngreso = DateTime.UtcNow;

                var userId = User.FindFirst("id")?.Value;
                if (userId == null) return Unauthorized(new { message = "Usuario no autenticado" });

                lote.usuarioIngresoId = int.Parse(userId);

                _context.Lotes.Add(lote);

                _context.LogsSistema.Add(LogHelper.CrearLog(
                    HttpContext,
                    "CREAR",
                    "Lote",
                    $"Se creó el lote '{lote.numeroLote}' para el producto ID {lote.productoId}."
                ));

                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetLote), new { id = lote.Id }, lote);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // PUT: api/lote/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLote(int id, Lote lote)
        {
            try
            {
                if (id != lote.Id)
                    return BadRequest(new { message = "El ID no coincide con el lote proporcionado" });

                var existing = await _context.Lotes.FindAsync(id);
                if (existing == null)
                    return NotFound(new { message = "Lote no encontrado" });

                existing.numeroLote = lote.numeroLote;
                existing.productoId = lote.productoId;
                existing.fechaVencimiento = lote.fechaVencimiento;
                existing.precio = lote.precio;
                existing.cantidad = lote.cantidad;
                existing.ubicacion = lote.ubicacion;

                _context.LogsSistema.Add(LogHelper.CrearLog(
                    HttpContext,
                    "ACTUALIZAR",
                    "Lote",
                    $"Se actualizó el lote ID {id}."
                ));

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // DELETE: api/lote/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLote(int id)
        {
            try
            {
                var lote = await _context.Lotes.FindAsync(id);
                if (lote == null)
                    return NotFound(new { message = "Lote no encontrado" });

                _context.Lotes.Remove(lote);

                _context.LogsSistema.Add(LogHelper.CrearLog(
                    HttpContext,
                    "ELIMINAR",
                    "Lote",
                    $"Se eliminó el lote ID {id}."
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
