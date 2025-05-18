using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace bgmarketDB.Models
{
    public class MovimientoInventario
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("loteId")]
        public int loteId { get; set; }
        public virtual Lote? Lote { get; set; }

        [ForeignKey("usuarioId")]
        public int usuarioId { get; set; }
        public Usuario? Usuario { get; set; }

        public string tipoMovimiento { get; set; }
        public DateTime fechaMovimiento { get; set; }
        public int cantidadAnterior { get; set; }
        public int cantidadMovimiento { get; set; }
        public int cantidadResultante { get; set; }
        public string observacion { get; set; }


    }
}
