using Microsoft.EntityFrameworkCore;
using JabilTest.API.Models;

namespace JabilTest.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Estas propiedades representan las tablas en SQL Server
        public DbSet<Director> Directors { get; set; }
        public DbSet<Movie> Movies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configuramos el comportamiento al borrar (Delete Cascade)
            modelBuilder.Entity<Movie>()
                .HasOne(m => m.Director)
                .WithMany(d => d.Movies)
                .HasForeignKey(m => m.FKDirector)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}