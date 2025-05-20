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
    public class ProductoController : ControllerBase
    {
        private readonly bgmarketContext _context;

        public ProductoController(bgmarketContext context)
        {
            _context = context;
        }

        // GET: api/producto?page=1&pageSize=10
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                if (page <= 0) page = 1;
                if (pageSize <= 0 || pageSize > 100) pageSize = 10;

                var totalItems = await _context.Productos.CountAsync();

                var productos = await _context.Productos
                    .Include(p => p.Categoria)
                    .Include(p => p.Lotes)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                Response.Headers.Add("X-Total-Count", totalItems.ToString());
                Response.Headers.Add("X-Page", page.ToString());
                Response.Headers.Add("X-PageSize", pageSize.ToString());

                return Ok(productos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // GET: api/producto/5
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            try
            {
                var producto = await _context.Productos
                    .Include(p => p.Categoria)
                    .Include(p => p.Lotes)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (producto == null)
                    return NotFound(new { message = "Producto no encontrado" });

                return Ok(producto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // POST: api/producto
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Producto>> CreateProducto(Producto producto)
        {
            try
            {
                if (producto == null || string.IsNullOrWhiteSpace(producto.codigo))
                    return BadRequest(new { message = "Datos inválidos para el producto" });

                var existe = await _context.Productos
                    .AnyAsync(p => p.codigo.ToLower() == producto.codigo.ToLower());

                if (existe)
                    return BadRequest(new { message = "Ya existe un producto con ese código." });

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
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // PUT: api/producto/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProducto(int id, Producto producto)
        {
            try
            {
                if (id != producto.Id)
                    return BadRequest(new { message = "El ID no coincide con el producto proporcionado" });

                var existing = await _context.Productos.FindAsync(id);
                if (existing == null)
                    return NotFound(new { message = "Producto no encontrado" });

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
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        // DELETE: api/producto/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            try
            {
                var producto = await _context.Productos.FindAsync(id);
                if (producto == null)
                    return NotFound(new { message = "Producto no encontrado" });

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
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }
    }
}
