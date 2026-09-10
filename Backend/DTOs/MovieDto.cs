using System.ComponentModel.DataAnnotations;

namespace JabilTest.API.DTOs;

public class MovieDto
{
    public int PKMovies { get; set; }

    [Required(ErrorMessage = "El nombre de la película es obligatorio")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Gender { get; set; }

    public TimeSpan? Duration { get; set; }

    [Required(ErrorMessage = "El director es obligatorio")]
    public int FKDirector { get; set; }

    public string? DirectorName { get; set; }
}

public class CreateMovieDto
{
    [Required(ErrorMessage = "El nombre de la película es obligatorio")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Gender { get; set; }

    public TimeSpan? Duration { get; set; }

    [Required(ErrorMessage = "El director es obligatorio")]
    public int FKDirector { get; set; }
}

public class UpdateMovieDto
{
    [Required(ErrorMessage = "El nombre de la película es obligatorio")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Gender { get; set; }

    public TimeSpan? Duration { get; set; }

    [Required(ErrorMessage = "El director es obligatorio")]
    public int FKDirector { get; set; }
}

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasPreviousPage => PageNumber > 1;
    public bool HasNextPage => PageNumber < TotalPages;
}