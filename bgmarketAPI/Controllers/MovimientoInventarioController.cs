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
    [Authorize]  // Requiere autenticación, sin restricción de rol
    public class MovimientoInventarioController : ControllerBase
    {
        private readonly bgmarketContext _context;

        public MovimientoInventarioController(bgmarketContext context)
        {
            _context = context;
        }

        // GET: api/movimientoinventario?page=1&pageSize=10
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovimientoInventario>>> GetMovimientoInventarios([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                if (page <= 0) page = 1;
                if (pageSize <= 0 || pageSize > 100) pageSize = 10;

                var totalItems = await _context.MovimientosInventario.CountAsync();

                var movimientos = await _context.MovimientosInventario
                    .Include(m => m.Lote)
                    .Include(m => m.Usuario)
                    .OrderByDescending(m => m.fechaMovimiento)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                Response.Headers.Add("X-Total-Count", totalItems.ToString());
                Response.Headers.Add("X-Page", page.ToString());
                Response.Headers.Add("X-PageSize", pageSize.ToString());

                return Ok(movimientos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // GET: api/movimientoinventario/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MovimientoInventario>> GetMovimientoInventario(int id)
        {
            try
            {
                var movimiento = await _context.MovimientosInventario
                    .Include(m => m.Lote)
                    .Include(m => m.Usuario)
                    .FirstOrDefaultAsync(m => m.Id == id);

                if (movimiento == null)
                    return NotFound(new { message = "Movimiento no encontrado" });

                return Ok(movimiento);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // POST: api/movimientoinventario
        [HttpPost]
        public async Task<ActionResult<MovimientoInventario>> CreateMovimiento(MovimientoInventario input)
        {
            try
            {
                if (input == null)
                    return BadRequest(new { message = "Datos del movimiento inválidos" });

                var lote = await _context.Lotes.FindAsync(input.loteId);
                if (lote == null)
                    return BadRequest(new { message = "El lote no existe." });

                var userId = User.FindFirst("id")?.Value;
                if (userId == null)
                    return Unauthorized(new { message = "Usuario no autenticado" });

                var cantidadAnterior = lote.cantidad;
                int resultante;

                if (string.IsNullOrWhiteSpace(input.tipoMovimiento))
                {
                    return BadRequest(new { message = "El tipo de movimiento es requerido" });
                }

                var tipoMovimiento = input.tipoMovimiento.Trim().ToLower();

                if (tipoMovimiento == "entrada")
                {
                    resultante = cantidadAnterior + input.cantidadMovimiento;
                }
                else if (tipoMovimiento == "salida")
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
                    tipoMovimiento = tipoMovimiento,
                    fechaMovimiento = DateTime.UtcNow,
                    cantidadAnterior = cantidadAnterior,
                    cantidadMovimiento = input.cantidadMovimiento,
                    cantidadResultante = resultante,
                    observacion = input.observacion
                };

                lote.cantidad = resultante;

                _context.MovimientosInventario.Add(movimiento);

                _context.LogsSistema.Add(LogHelper.CrearLog(
                    HttpContext,
                    tipoMovimiento.ToUpper(),
                    "MovimientoInventario",
                    $"Movimiento de tipo '{tipoMovimiento}' de {input.cantidadMovimiento} unidades en el lote ID {input.loteId}. Resultado: {resultante} unidades."
                ));

                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetMovimientoInventario), new { id = movimiento.Id }, movimiento);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }
    }
}
