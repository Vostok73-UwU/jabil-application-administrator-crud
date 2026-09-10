using JabilTest.API.Data;
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Director>>> GetDirectors()
        {
            return await _context.Directors.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Director>> GetDirector(int id)
        {
            var director = await _context.Directors.FindAsync(id);

            if (director == null)
            {
                return NotFound();
            }

            return director;
        }

        [HttpPost]
        public async Task<ActionResult<Director>> PostDirector(Director director)
        {
            _context.Directors.Add(director);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDirector), new { id = director.PKDirector }, director);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDirector(int id, Director director)
        {
            if (id != director.PKDirector)
            {
                return BadRequest("El ID de la URL no coincide con el ID del cuerpo de la petición.");
            }

            _context.Entry(director).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DirectorExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDirector(int id)
        {
            var director = await _context.Directors.FindAsync(id);
            if (director == null)
            {
                return NotFound();
            }

            _context.Directors.Remove(director);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DirectorExists(int id)
        {
            return _context.Directors.Any(e => e.PKDirector == id);
        }
    }
}