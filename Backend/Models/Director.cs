using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JabilTest.API.Models
{
    public class Director
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PKDirector { get; set; }

        [Required(ErrorMessage = "El nombre del director es obligatorio")]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public int? Age { get; set; }

        public bool Active { get; set; } = true;

        // Propiedad de navegación (Un director puede tener muchas películas)
        public virtual ICollection<Movie> Movies { get; set; } = new List<Movie>();
    }
}