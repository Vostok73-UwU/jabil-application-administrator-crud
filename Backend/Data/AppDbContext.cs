using Microsoft.EntityFrameworkCore;
using JabilTest.API.Models;

namespace JabilTest.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Director> Directors { get; set; }
        public DbSet<Movie> Movies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Director>().ToTable("Director");
            modelBuilder.Entity<Movie>().ToTable("Movies");
            
            modelBuilder.Entity<Movie>()
                .HasOne(m => m.Director)
                .WithMany(d => d.Movies)
                .HasForeignKey(m => m.FKDirector)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}