using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using eCommerceApi.Models;

namespace eCommerceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageQueriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MessageQueriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/MessageQueries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessagesModel>>> GetQueries()
        {
            return await _context.Messages.ToListAsync();
        }

        // GET: api/MessageQueries/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MessagesModel>> GetMessageQueries(int id)
        {
            var messageQueries = await _context.Messages.FindAsync(id);

            if (messageQueries == null)
            {
                return NotFound();
            }

            return messageQueries;
        }

        // PUT: api/MessageQueries/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMessageQueries(int id, MessagesModel messageQueries)
        {
            if (id != messageQueries.QueryId)
            {
                return BadRequest();
            }

            _context.Entry(messageQueries).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MessageQueriesExists(id))
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

        // POST: api/MessageQueries
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<MessagesModel>> PostMessageQueries(MessagesModel messageQueries)
        {
            _context.Messages.Add(messageQueries);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMessageQueries", new { id = messageQueries.QueryId }, messageQueries);
        }

        // DELETE: api/MessageQueries/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessageQueries(int id)
        {
            var messageQueries = await _context.Messages.FindAsync(id);
            if (messageQueries == null)
            {
                return NotFound();
            }

            _context.Messages.Remove(messageQueries);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MessageQueriesExists(int id)
        {
            return _context.Messages.Any(e => e.QueryId == id);
        }
    }
}
