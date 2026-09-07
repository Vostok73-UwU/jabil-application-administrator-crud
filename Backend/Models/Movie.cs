using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace JabilTest.API.Models
{
    public class Movie
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PKMovies { get; set; }

        [Required(ErrorMessage = "El nombre de la película es obligatorio")]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? Gender { get; set; }

        // TimeSpan mapea perfectamente con el tipo de dato TIME de SQL Server
        public TimeSpan? Duration { get; set; }

        [Required]
        public int FKDirector { get; set; }

        // Propiedad de navegación
        [ForeignKey("FKDirector")]
        [JsonIgnore] // Evita ciclos infinitos al serializar las respuestas JSON
        public virtual Director? Director { get; set; }
    }
}