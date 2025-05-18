using Microsoft.EntityFrameworkCore;
using bgmarketDB.Models; // Asegúrate que esta ruta contenga tus entidades

namespace bgmarketDB
{
    public class bgmarketContext : DbContext
    {
        public bgmarketContext(DbContextOptions<bgmarketContext> options) : base(options)
        {
        }

        // DbSet por cada entidad (tabla)
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Lote> Lotes { get; set; }
        public DbSet<MovimientoInventario> MovimientosInventario { get; set; }
        public DbSet<LogSistema> LogsSistema { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Evita el cascade delete entre Lote y Usuario
            modelBuilder.Entity<Lote>()
                .HasOne(l => l.UsuarioIngreso)
                .WithMany(u => u.LotesIngresados)
                .HasForeignKey(l => l.usuarioIngresoId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MovimientoInventario>()
                .HasOne(m => m.Usuario)
                .WithMany(u => u.Movimientos)
                .HasForeignKey(m => m.usuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Lote>()
            .Property(l => l.precio)
            .HasColumnType("decimal(10,2)");
             
        }
    }
}
