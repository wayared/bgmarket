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
    [Authorize]  // Solo requiere que el usuario esté autenticado, sin restricción de rol
    public class MovimientoInventarioController : ControllerBase
    {
        private readonly bgmarketContext _context;

        public MovimientoInventarioController(bgmarketContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovimientoInventario>>> GetMovimientoInventarios()
        {
            var movimientos = await _context.MovimientosInventario
                .Include(m => m.Lote)
                .Include(m => m.Usuario)
                .ToListAsync();
            return movimientos;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MovimientoInventario>> GetMovimientoInventario(int id)
        {
            var movimiento = await _context.MovimientosInventario
                .Include(m => m.Lote)
                .Include(m => m.Usuario)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (movimiento == null) return NotFound();
            return movimiento;
        }

        [HttpPost]
        public async Task<ActionResult<MovimientoInventario>> CreateMovimiento(MovimientoInventario input)
        {
            var lote = await _context.Lotes.FindAsync(input.loteId);
            if (lote == null)
                return BadRequest(new { message = "El lote no existe." });

            var userId = User.FindFirst("id")?.Value;
            if (userId == null) return Unauthorized();

            var cantidadAnterior = lote.cantidad;
            int resultante;

            if (input.tipoMovimiento.ToLower() == "entrada")
                resultante = cantidadAnterior + input.cantidadMovimiento;
            else if (input.tipoMovimiento.ToLower() == "salida")
            {
                if (cantidadAnterior < input.cantidadMovimiento)
                    return BadRequest(new { message = "No hay suficiente stock en el lote." });

                resultante = cantidadAnterior - input.cantidadMovimiento;
            }
            else
            {
                return BadRequest(new { message = "TipoMovimiento debe ser 'entrada' o 'salida'" });
            }

            var movimiento = new MovimientoInventario
            {
                loteId = input.loteId,
                usuarioId = int.Parse(userId),
                tipoMovimiento = input.tipoMovimiento,
                fechaMovimiento = DateTime.UtcNow,
                cantidadAnterior = cantidadAnterior,
                cantidadMovimiento = input.cantidadMovimiento,
                cantidadResultante = resultante,
                observacion = input.observacion
            };

            lote.cantidad = resultante;

            _context.MovimientosInventario.Add(movimiento);

            // Registrar log con LogHelper
            _context.LogsSistema.Add(LogHelper.CrearLog(
                HttpContext,
                input.tipoMovimiento.ToUpper(),
                "MovimientoInventario",
                $"Movimiento de tipo '{input.tipoMovimiento}' de {input.cantidadMovimiento} unidades en el lote ID {input.loteId}. Resultado: {resultante} unidades."
            ));

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMovimientoInventario), new { id = movimiento.Id }, movimiento);
        }
    }
}
