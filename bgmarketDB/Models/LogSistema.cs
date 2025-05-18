using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace bgmarketDB.Models
{
    public class LogSistema
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("usuarioId")]
        public int usuarioId { get; set; }
        public virtual Usuario usuario { get; set; }

        public string accion { get; set; }
        public string entidad { get; set; }
        public string detalle { get; set; }
        public DateTime fechaRegistro { get; set; }
        public string ipOrigen { get; set; }
    }
}
