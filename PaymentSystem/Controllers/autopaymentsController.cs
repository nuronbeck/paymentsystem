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
    [Route("autopayments")]
    [ApiController]
    public class autopaymentsController : ControllerBase
    {
        private readonly paymentsystemContext _context;

        public autopaymentsController(paymentsystemContext context)
        {
            _context = context;
        }

        // GET: /autopayments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<autopayment>>> getMyAutoPayments([FromHeader] string apiToken)
        {
            AuthController newAuth = new AuthController(_context);
            var ActionResult = await newAuth.getId(apiToken);
            var client = ActionResult as OkObjectResult;

            if(client != null)
            {
                int userId = (int)client.Value;
                var autopayments = await _context.autopayment.Where(x=>x.sender_id==userId).FirstAsync();
                if (autopayments == null)
                {
                    return null;
                }
                return Ok(autopayments);
            }
            else
            {
                return NotFound("Пользователя с таким токеном нет");
            }
        }

        [Route("frozen")]
        [HttpPost]
        public async Task<ActionResult<autopayment>> Frozen([FromBody] int id,[FromHeader] string apiToken)
        {
            AuthController newAuth = new AuthController(_context);
            var ActionResult = await newAuth.getId(apiToken);
            var client = ActionResult as OkObjectResult;
            if (client != null)
            {
                int userId = (int)client.Value;
                var autopayment = await _context.autopayment.Where(x => x.sender_id == userId && x.id_autopayment == id).FirstOrDefaultAsync();
                if (autopayment == null)
                {
                    return null;
                }

                autopayment.freezing = true;

                autopayment.comm = "Автоплатеж заморожен по желанию пользователя. Дата - " + DateTime.Today.ToString("g");

                //нужно, чтобы было состояние "редактируется"
                
                _context.Entry(autopayment).State = EntityState.Modified;

                await _context.SaveChangesAsync();

                return Ok("Операция заморозки карты ");
            }
            else
            {
                return NotFound("Данный пользователь недоступен");
            }
        }

        // GET: api/autopayments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<autopayment>> Getautopayment(int id, [FromHeader] string apiToken)
        {
            AuthController newAuth = new AuthController(_context);
            var ActionResult = await newAuth.getId(apiToken);
            var client = ActionResult as OkObjectResult;
            if (client != null)
            {
                int userId = (int)client.Value;
                var autopayment = await _context.autopayment.Where(x => x.sender_id == userId && x.id_autopayment == id).FirstOrDefaultAsync();
                if (autopayment == null)
                {
                    return null;
                }
                return autopayment;
            }
            else
            {
                return NotFound("Данный пользователь недоступен");
            }
        }

        // PUT: /autopayments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Putautopayment(int id,[FromBody] autopayment autopayment, [FromHeader] string apiToken)
        {
            AuthController newAuth = new AuthController(_context);
            var ActionResult = await newAuth.getId(apiToken);
            var client = ActionResult as OkObjectResult;
            if (client != null)
            {
                if (id != autopayment.id_autopayment)
                {
                    return BadRequest();
                }

                _context.Entry(autopayment).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!autopaymentExists(id,(int) client.Value))
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
            else
            {
                return NotFound("Авторизуйтесь, чтобы внести изменения");
            }
           
        }

        // POST: api/autopayments
        [HttpPost]
        public async Task<ActionResult<autopayment>> Postautopayment([FromBody]autopayment autopayment, [FromHeader] string apiToken)
        {
            AuthController newAuth = new AuthController(_context);
            var ActionResult = await newAuth.getId(apiToken);
            var client = ActionResult as OkObjectResult;
            if (client != null)
            {
                var acc = await _context.Acc.Where(x=>x.client_id==(int)client.Value).FirstAsync();
                if (acc != null)
                {
                    if((acc.balance_acc - autopayment.sum) >= acc.balance_acc)
                    {
                        _context.autopayment.Add(autopayment);
                        await _context.SaveChangesAsync();
                        return CreatedAtAction("Getautopayment", new { id = autopayment.id_autopayment }, autopayment);
                    }
                    else
                        NotFound("На счету не достаточно средств, чтобы добавить автоплатеж");
                }
                else
                    NotFound("Такого счета нет");
            }
            else
            {
                return NotFound("Авторизуйтесь, чтобы внести изменения");
            }
            return NoContent();
        }

        // DELETE: api/autopayments/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<autopayment>> Deleteautopayment(int id, [FromHeader] string apiToken)
        {
            AuthController newAuth = new AuthController(_context);
            var ActionResult = await newAuth.getId(apiToken);
            var client = ActionResult as OkObjectResult;
            if (client != null)
            {
                var autopayment = await _context.autopayment.Where(x=>x.id_autopayment == id && x.sender_id == (int)client.Value).FirstAsync();
                if (autopayment == null)
                {
                    return NotFound();
                }

                _context.autopayment.Remove(autopayment);
                await _context.SaveChangesAsync();

                return autopayment;
            }
            else
            {
                return NotFound("Авторизуйтесь, чтобы внести изменения");
            }
        }

        private bool autopaymentExists(int id, int sender_id)
        {
            return _context.autopayment.Any(e => e.id_autopayment == id && e.sender_id == sender_id);
        }
    }
}
