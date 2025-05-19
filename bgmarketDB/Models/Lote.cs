using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace bgmarketDB.Models
{
    public class Lote
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("productoId")]
        public int productoId { get; set; }
        public Producto? Producto { get; set; }

        public string numeroLote { get; set; }
        public DateTime fechaIngreso { get; set; }
        public decimal precio { get; set; }
        public int cantidad { get; set; }
        public string ubicacion { get; set; }
        public DateTime fechaVencimiento { get; set; }

        [ForeignKey("usuarioIngresoId")]
        public int usuarioIngresoId { get; set; }
        public Usuario? UsuarioIngreso { get; set; }

        public ICollection<MovimientoInventario>? Movimientos { get; set; }

    }
}