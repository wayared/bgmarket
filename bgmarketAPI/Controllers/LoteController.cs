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
    [Authorize(Roles = "Admin")]
    public class LoteController : ControllerBase
    {
        private readonly bgmarketContext _context;

        public LoteController(bgmarketContext context)
        {
            _context = context;
        }

        // GET: api/lote
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Lote>>> GetLotes()
        {
            return await _context.Lotes
                .Include(l => l.Producto)
                .Include(l => l.UsuarioIngreso)
                .ToListAsync();
        }

        // GET: api/lote/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Lote>> GetLote(int id)
        {
            var lote = await _context.Lotes
                .Include(l => l.Producto)
                .Include(l => l.UsuarioIngreso)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (lote == null) return NotFound();
            return lote;
        }

        // POST: api/lote
        [HttpPost]
        public async Task<ActionResult<Lote>> CreateLote(Lote lote)
        {
            // ✅ Verificar duplicado
            var duplicado = await _context.Lotes.AnyAsync(l =>
                l.numeroLote.ToLower() == lote.numeroLote.ToLower() &&
                l.productoId == lote.productoId);

            if (duplicado)
            {
                return BadRequest(new { message = "Ya existe un lote con ese número para este producto." });
            }

            lote.fechaIngreso = DateTime.UtcNow;

            var userId = User.FindFirst("id")?.Value;
            if (userId == null) return Unauthorized();

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


        // PUT: api/lote/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLote(int id, Lote lote)
        {
            if (id != lote.Id) return BadRequest();

            var existing = await _context.Lotes.FindAsync(id);
            if (existing == null) return NotFound();

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

        // DELETE: api/lote/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLote(int id)
        {
            var lote = await _context.Lotes.FindAsync(id);
            if (lote == null) return NotFound();

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
    }
}