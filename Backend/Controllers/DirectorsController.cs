using JabilTest.API.Data;
using JabilTest.API.DTOs;
using JabilTest.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JabilTest.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DirectorsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DirectorsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Directors
        [HttpGet]
        public async Task<ActionResult<PagedResult<DirectorDto>>> GetDirectors(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null,
            bool? activeOnly = null)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;

            var query = _context.Directors.AsQueryable();

            if (activeOnly == true)
            {
                query = query.Where(d => d.Active);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(d => d.Name.Contains(search));
            }

            var totalCount = await query.CountAsync();

            var directors = await query
                .OrderBy(d => d.PKDirector)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(d => new DirectorDto
                {
                    PKDirector = d.PKDirector,
                    Name = d.Name,
                    Age = d.Age,
                    Active = d.Active,
                    MoviesCount = d.Movies.Count()
                })
                .ToListAsync();

            return Ok(new PagedResult<DirectorDto>
            {
                Items = directors,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            });
        }

        // GET: api/Directors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DirectorDto>> GetDirector(int id)
        {
            var director = await _context.Directors
                .Include(d => d.Movies)
                .FirstOrDefaultAsync(d => d.PKDirector == id);

            if (director == null)
            {
                return NotFound(new { message = $"Director con ID {id} no encontrado." });
            }

            return Ok(new DirectorDto
            {
                PKDirector = director.PKDirector,
                Name = director.Name,
                Age = director.Age,
                Active = director.Active,
                MoviesCount = director.Movies.Count
            });
        }

        // POST: api/Directors
        [HttpPost]
        public async Task<ActionResult<DirectorDto>> PostDirector(CreateDirectorDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var director = new Director
            {
                Name = createDto.Name,
                Age = createDto.Age,
                Active = createDto.Active
            };

            _context.Directors.Add(director);
            await _context.SaveChangesAsync();

            var resultDto = new DirectorDto
            {
                PKDirector = director.PKDirector,
                Name = director.Name,
                Age = director.Age,
                Active = director.Active,
                MoviesCount = 0
            };

            return CreatedAtAction(nameof(GetDirector), new { id = director.PKDirector }, resultDto);
        }

        // PUT: api/Directors/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDirector(int id, UpdateDirectorDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var director = await _context.Directors.FindAsync(id);
            if (director == null)
            {
                return NotFound(new { message = $"Director con ID {id} no encontrado." });
            }

            director.Name = updateDto.Name;
            director.Age = updateDto.Age;
            director.Active = updateDto.Active;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DirectorExists(id))
                {
                    return NotFound(new { message = $"Director con ID {id} no encontrado." });
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Directors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDirector(int id)
        {
            var director = await _context.Directors
                .Include(d => d.Movies)
                .FirstOrDefaultAsync(d => d.PKDirector == id);

            if (director == null)
            {
                return NotFound(new { message = $"Director con ID {id} no encontrado." });
            }

            // Retornamos el error en formato JSON para que Angular lo pueda leer
            if (director.Movies.Count > 0)
            {
                return BadRequest(new { message = $"No se puede eliminar el director '{director.Name}' porque tiene {director.Movies.Count} película(s) asociada(s). Elimine primero las películas o inactívelo." });
            }

            _context.Directors.Remove(director);
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return BadRequest(new { message = "Error de base de datos: No se puede eliminar este director por una restricción de llave foránea." });
            }

            return NoContent();
        }

        private bool DirectorExists(int id)
        {
            return _context.Directors.Any(e => e.PKDirector == id);
        }
    }
}