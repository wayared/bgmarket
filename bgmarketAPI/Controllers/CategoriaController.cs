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
    [Authorize(Roles = "Admin")] // Solo administradores pueden acceder
    public class CategoriaController : ControllerBase
    {
        private readonly bgmarketContext _context;

        public CategoriaController(bgmarketContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
        {
            return await _context.Categorias.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> GetCategoria(int id)
        {
            var categoria = await _context.Categorias
                .Include(c => c.Productos)
                .FirstOrDefaultAsync(c => c.Id == id);
            if (categoria == null) return NotFound();
            return Ok(categoria);
        }

        //  POST: api/categoria
        [HttpPost]
        public async Task<ActionResult<Categoria>> CreateCategoria(Categoria categoria)
        {
            // ✅ Validar duplicado
            var existe = await _context.Categorias
                .AnyAsync(c => c.nombre.ToLower() == categoria.nombre.ToLower());

            if (existe)
            {
                return BadRequest(new { message = "Ya existe una categoría con ese nombre." });
            }

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


        //  PUT: api/categoria/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategoria(int id, Categoria categoria)
        {
            if (id != categoria.Id) return BadRequest();

            var existing = await _context.Categorias.FindAsync(id);
            if (existing == null) return NotFound();

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

        // DELETE: api/categoria/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null) return NotFound();

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
    }
}
