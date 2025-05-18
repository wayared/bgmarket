using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace bgmarketDB.Models
{
    public class Usuario
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string usuario { get; set; }
        [Required]
        public string password { get; set; }
        public string nombre { get; set; }
        public string apellido { get; set; }
        public string email { get; set; }
        public string rol { get; set; }
        public DateTime fechaCreacion { get; set; }
        public bool Activo { get; set; }

        public ICollection<LogSistema>? LogsSistema { get; set; }
        public ICollection<Lote>? LotesIngresados { get; set; }
        public ICollection<MovimientoInventario>? Movimientos { get; set; }
    }
}
