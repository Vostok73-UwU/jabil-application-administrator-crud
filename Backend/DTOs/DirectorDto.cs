using System.ComponentModel.DataAnnotations;

namespace JabilTest.API.DTOs;

public class DirectorDto
{
    public int PKDirector { get; set; }

    [Required(ErrorMessage = "El nombre del director es obligatorio")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public int? Age { get; set; }

    public bool Active { get; set; }

    public int MoviesCount { get; set; }
}

public class CreateDirectorDto
{
    [Required(ErrorMessage = "El nombre del director es obligatorio")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public int? Age { get; set; }

    public bool Active { get; set; } = true;
}

public class UpdateDirectorDto
{
    [Required(ErrorMessage = "El nombre del director es obligatorio")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public int? Age { get; set; }

    public bool Active { get; set; } = true;
}