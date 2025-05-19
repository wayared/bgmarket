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
    public class ProductoController : ControllerBase
    {
        private readonly bgmarketContext _context;

        public ProductoController(bgmarketContext context)
        {
            _context = context;
        }

        // GET: api/producto
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            return await _context.Productos
                .Include(p => p.Categoria)
                .Include(p => p.Lotes)
                .ToListAsync();
        }

        // GET: api/producto/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            var producto = await _context.Productos
                .Include(p => p.Categoria)
                .Include(p => p.Lotes)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (producto == null) return NotFound();
            return Ok(producto);
        }

        // POST: api/producto
        [HttpPost]
        public async Task<ActionResult<Producto>> CreateProducto(Producto producto)
        {
            // ✅ Validar que no exista otro con el mismo código
            var existe = await _context.Productos
                .AnyAsync(p => p.codigo.ToLower() == producto.codigo.ToLower());

            if (existe)
            {
                return BadRequest(new { message = "Ya existe un producto con ese código." });
            }

            producto.fechaCreacion = DateTime.UtcNow;
            producto.activo = true;

            _context.Productos.Add(producto);

            _context.LogsSistema.Add(LogHelper.CrearLog(
                HttpContext,
                "CREAR",
                "Producto",
                $"Producto '{producto.nombre}' fue creado."
            ));

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProducto), new { id = producto.Id }, producto);
        }


        // PUT: api/producto/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProducto(int id, Producto producto)
        {
            if (id != producto.Id) return BadRequest();

            var existing = await _context.Productos.FindAsync(id);
            if (existing == null) return NotFound();

            existing.nombre = producto.nombre;
            existing.descripcion = producto.descripcion;
            existing.codigo = producto.codigo;
            existing.unidadMedida = producto.unidadMedida;
            existing.categoriaId = producto.categoriaId;
            existing.activo = producto.activo;

            _context.LogsSistema.Add(LogHelper.CrearLog(
                HttpContext,
                "ACTUALIZAR",
                "Producto",
                $"Producto ID {id} actualizado."
            ));

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/producto/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null) return NotFound();

            _context.Productos.Remove(producto);

            _context.LogsSistema.Add(LogHelper.CrearLog(
                HttpContext,
                "ELIMINAR",
                "Producto",
                $"Producto ID {id} eliminado."
            ));

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}