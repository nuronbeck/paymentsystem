using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PaymentSystem.Models;

namespace PaymentSystem.Controllers
{
    [Route("autopayment_range")]
    [ApiController]
    public class autopayment_rangeController : ControllerBase
    {
        private readonly paymentsystemContext _context;

        public autopayment_rangeController(paymentsystemContext context)
        {
            _context = context;
        }

        // GET: api/autopayment_range
        [HttpGet]
        public async Task<ActionResult<IEnumerable<autopayment_range>>> Getautopayment_range()
        {
            return await _context.autopayment_range.ToListAsync();
        }

        // GET: api/autopayment_range/5
        [HttpGet("{id}")]
        public async Task<ActionResult<autopayment_range>> Getautopayment_range(int id)
        {
            var autopayment_range = await _context.autopayment_range.FindAsync(id);

            if (autopayment_range == null)
            {
                return NotFound();
            }

            return autopayment_range;
        }

        // PUT: api/autopayment_range/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> Putautopayment_range(int id, autopayment_range autopayment_range)
        {
            if (id != autopayment_range.id_autopayment_range)
            {
                return BadRequest();
            }

            _context.Entry(autopayment_range).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!autopayment_rangeExists(id))
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

        // POST: api/autopayment_range
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<autopayment_range>> Postautopayment_range(autopayment_range autopayment_range)
        {
            _context.autopayment_range.Add(autopayment_range);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getautopayment_range", new { id = autopayment_range.id_autopayment_range }, autopayment_range);
        }

        // DELETE: api/autopayment_range/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<autopayment_range>> Deleteautopayment_range(int id)
        {
            var autopayment_range = await _context.autopayment_range.FindAsync(id);
            if (autopayment_range == null)
            {
                return NotFound();
            }

            _context.autopayment_range.Remove(autopayment_range);
            await _context.SaveChangesAsync();

            return autopayment_range;
        }

        private bool autopayment_rangeExists(int id)
        {
            return _context.autopayment_range.Any(e => e.id_autopayment_range == id);
        }
    }
}
