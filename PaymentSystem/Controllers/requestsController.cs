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
    [Route("applications")]
    [ApiController]
    public class requestsController : ControllerBase
    {
        private readonly paymentsystemContext _context;

        public requestsController(paymentsystemContext context)
        {
            _context = context;
        }

        // GET: applications/
        [HttpGet]
        public async Task<ActionResult<IEnumerable<request>>> Getrequest()
        {
            return await _context.request
                .Include(x=>x.type_acc_)
                .Include(x => x.client_)
                .Include(x => x.status_request_)
                .ToListAsync();
        }

        [HttpGet]
        [Route("add")]
        public async Task<ActionResult<IEnumerable<type_acc>>> GetrequestAdd()
        {
            type_accController TypeAcc = new type_accController(_context);
            
            return await TypeAcc.Gettype_acc(); ;
        }

        // GET: api/requests/5
        [HttpGet("{id}")]
        public async Task<ActionResult<request>> Getrequest(int id)
        {
            var request = await _context.request.FindAsync(id);

            if (request == null)
            {
                return NotFound();
            }

            return request;
        }

        // PUT: api/requests/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> Putrequest(int id, request request)
        {
            if (id != request.id_request)
            {
                return BadRequest();
            }

            _context.Entry(request).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!requestExists(id))
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

        public class RequestApproval 
        {
            public int id;
            public int s_r_id;   
        }
        [HttpPost]
        [Route("approval")]
        public async Task<ActionResult<request>> PostrequestApproval([FromBody] RequestApproval ra, [FromHeader] string api_token)
        {
            AuthController newAuth = new AuthController(_context);
            var ActionResult = await newAuth.getId(api_token);
            var OkObjectResult = ActionResult as OkObjectResult;

            int userId = (int)OkObjectResult.Value;

            int? credit_rate = null;
            if (_context.request.Any(x=>x.id_request== ra.id))
            {
                var app_request =_context.request.Where(x => x.id_request == ra.id).ToList();
                if (app_request[0].status_request_id == 1)
                    return Ok();
                else
                {
                    app_request[0].status_request_id = ra.s_r_id;
                    await _context.SaveChangesAsync();
                    var UpdatedApp = await _context.request.FindAsync(ra.id);                           //1-accepted 2-rejected 3-approval
                    if (ra.s_r_id == 1)
                    {
                        AccsController Acc = new AccsController(_context);
                        if (app_request[0].type_acc_id==3)
                            credit_rate = 2;
                        Acc new_acc = new Acc
                        {
                            balance_acc = credit_rate==2 ? _context.credit_rate.Where(x => x.id_credit_rate == 2).ToList()[0].credit_limit:0,
                            credit_rate_id = credit_rate,
                            client_id = app_request[0].client_id,
                            date_open_acc = DateTime.Now,
                            date_close_acc = DateTime.Now.AddYears(4),
                            status_acc_id = 1,                                                            //1-open 2-frozen 3-closed
                            type_acc_id = app_request[0].type_acc_id
                        };
                        await Acc.PostAcc(new_acc);
                    }
                    return UpdatedApp;
                }
            }
            else
                return NotFound();
        }

        public class RequestAdd
        {
            public int type_account_id;
            public int income;
            public string place_job;
        }
        [HttpPost]
        [Route("add")]
        public async Task<ActionResult<request>> PostrequestAdd([FromBody]RequestAdd ra, [FromHeader] string api_token)
        {
            AuthController newAuth = new AuthController(_context);
            var ActionResult = await newAuth.getId(api_token);
            var OkObjectResult = ActionResult as OkObjectResult;

            int userId = (int)OkObjectResult.Value;
            if (_context.client.Any(x => x.id_client == userId))
            {
                request new_request = new request {
                    income = ra.income,
                    place_job = ra.place_job,
                    client_id = userId,
                    status_request_id = 3,
                    type_acc_id = ra.type_account_id
                };

                _context.request.Add(new_request);
                await _context.SaveChangesAsync();

                return CreatedAtAction("Getrequest", new { id = new_request.id_request }, new_request);
            }
            else
                return NotFound();
        }

        // DELETE: api/requests/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<request>> Deleterequest(int id)
        {
            var request = await _context.request.FindAsync(id);
            if (request == null)
            {
                return NotFound();
            }

            _context.request.Remove(request);
            await _context.SaveChangesAsync();

            return request;
        }

        private bool requestExists(int id)
        {
            return _context.request.Any(e => e.id_request == id);
        }
    }
}
