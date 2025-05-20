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
    public class CategoriaController : ControllerBase
    {
        private readonly bgmarketContext _context;

        public CategoriaController(bgmarketContext context)
        {
            _context = context;
        }

        // Permitir a todos obtener la lista de categorías con paginación
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                if (page <= 0) page = 1;
                if (pageSize <= 0 || pageSize > 100) pageSize = 10; // límite máximo 100 para evitar sobrecarga

                var totalItems = await _context.Categorias.CountAsync();

                var categorias = await _context.Categorias
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                // Puedes devolver metadata de paginación si quieres
                Response.Headers.Add("X-Total-Count", totalItems.ToString());
                Response.Headers.Add("X-Page", page.ToString());
                Response.Headers.Add("X-PageSize", pageSize.ToString());

                return Ok(categorias);
            }
            catch (Exception ex)
            {
                // Aquí puedes agregar logging real
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // Obtener una categoría por ID con sus productos
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> GetCategoria(int id)
        {
            try
            {
                var categoria = await _context.Categorias
                    .Include(c => c.Productos)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (categoria == null)
                    return NotFound(new { message = "Categoría no encontrada" });

                return Ok(categoria);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // Crear categoría (solo Admin)
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Categoria>> CreateCategoria(Categoria categoria)
        {
            try
            {
                if (categoria == null || string.IsNullOrWhiteSpace(categoria.nombre))
                    return BadRequest(new { message = "Datos inválidos para la categoría" });

                var existe = await _context.Categorias
                    .AnyAsync(c => c.nombre.ToLower() == categoria.nombre.ToLower());

                if (existe)
                    return BadRequest(new { message = "Ya existe una categoría con ese nombre." });

                _context.Categorias.Add(categoria);

                _context.LogsSistema.Add(LogHelper.CrearLog(
                    HttpContext,
                    "CREAR",
                    "Categoria",
                    $"Se creó la categoría '{categoria.nombre}'."
                ));

                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCategoria), new { id = categoria.Id }, categoria);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // Actualizar categoría (solo Admin)
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategoria(int id, Categoria categoria)
        {
            try
            {
                if (id != categoria.Id)
                    return BadRequest(new { message = "El ID no coincide con el cuerpo de la solicitud" });

                var existing = await _context.Categorias.FindAsync(id);
                if (existing == null)
                    return NotFound(new { message = "Categoría no encontrada" });

                existing.nombre = categoria.nombre;
                existing.descripcion = categoria.descripcion;

                _context.LogsSistema.Add(LogHelper.CrearLog(
                    HttpContext,
                    "ACTUALIZAR",
                    "Categoria",
                    $"Se actualizó la categoría ID {id}."
                ));

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // Eliminar categoría (solo Admin)
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategoria(int id)
        {
            try
            {
                var categoria = await _context.Categorias.FindAsync(id);
                if (categoria == null)
                    return NotFound(new { message = "Categoría no encontrada" });

                _context.Categorias.Remove(categoria);

                _context.LogsSistema.Add(LogHelper.CrearLog(
                    HttpContext,
                    "ELIMINAR",
                    "Categoria",
                    $"Se eliminó la categoría ID {id}."
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
