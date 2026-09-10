using JabilTest.API.Data;
using JabilTest.API.DTOs;
using JabilTest.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JabilTest.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MoviesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Movies
        [HttpGet]
        public async Task<ActionResult<PagedResult<MovieDto>>> GetMovies(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;

            var query = _context.Movies
                .Include(m => m.Director)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(m => m.Name.Contains(search) || 
                                        (m.Gender != null && m.Gender.Contains(search)) ||
                                        (m.Director != null && m.Director.Name.Contains(search)));
            }

            var totalCount = await query.CountAsync();

            var movies = await query
                .OrderBy(m => m.PKMovies)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new MovieDto
                {
                    PKMovies = m.PKMovies,
                    Name = m.Name,
                    Gender = m.Gender,
                    Duration = m.Duration,
                    FKDirector = m.FKDirector,
                    DirectorName = m.Director!.Name
                })
                .ToListAsync();

            return Ok(new PagedResult<MovieDto>
            {
                Items = movies,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            });
        }

        // GET: api/Movies/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MovieDto>> GetMovie(int id)
        {
            var movie = await _context.Movies
                .Include(m => m.Director)
                .FirstOrDefaultAsync(m => m.PKMovies == id);

            if (movie == null)
            {
                return NotFound($"Película con ID {id} no encontrada.");
            }

            return Ok(new MovieDto
            {
                PKMovies = movie.PKMovies,
                Name = movie.Name,
                Gender = movie.Gender,
                Duration = movie.Duration,
                FKDirector = movie.FKDirector,
                DirectorName = movie.Director!.Name
            });
        }

        // POST: api/Movies
        [HttpPost]
        public async Task<ActionResult<MovieDto>> PostMovie(CreateMovieDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var directorExists = await _context.Directors.AnyAsync(d => d.PKDirector == createDto.FKDirector);
            if (!directorExists)
            {
                return BadRequest($"El director con ID {createDto.FKDirector} no existe.");
            }

            var movie = new Movie
            {
                Name = createDto.Name,
                Gender = createDto.Gender,
                Duration = createDto.Duration,
                FKDirector = createDto.FKDirector
            };

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();

            var director = await _context.Directors.FindAsync(movie.FKDirector);

            var resultDto = new MovieDto
            {
                PKMovies = movie.PKMovies,
                Name = movie.Name,
                Gender = movie.Gender,
                Duration = movie.Duration,
                FKDirector = movie.FKDirector,
                DirectorName = director!.Name
            };

            return CreatedAtAction(nameof(GetMovie), new { id = movie.PKMovies }, resultDto);
        }

        // PUT: api/Movies/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMovie(int id, UpdateMovieDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
            {
                return NotFound($"Película con ID {id} no encontrada.");
            }

            var directorExists = await _context.Directors.AnyAsync(d => d.PKDirector == updateDto.FKDirector);
            if (!directorExists)
            {
                return BadRequest($"El director con ID {updateDto.FKDirector} no existe.");
            }

            movie.Name = updateDto.Name;
            movie.Gender = updateDto.Gender;
            movie.Duration = updateDto.Duration;
            movie.FKDirector = updateDto.FKDirector;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovieExists(id))
                {
                    return NotFound($"Película con ID {id} no encontrada.");
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Movies/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
            {
                return NotFound($"Película con ID {id} no encontrada.");
            }

            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MovieExists(int id)
        {
            return _context.Movies.Any(e => e.PKMovies == id);
        }
    }
}