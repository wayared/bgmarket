using System;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace bgmarketDB.Models
{
    public class Producto
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string codigo { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }

        [ForeignKey("categoriaId")]
        public int categoriaId { get; set; }
        public virtual Categoria? Categoria { get; set; }

        public string unidadMedida { get; set; }
        public DateTime fechaCreacion { get; set; }
        public bool activo { get; set; }

        public ICollection<Lote>? Lotes { get; set; }
    }
}