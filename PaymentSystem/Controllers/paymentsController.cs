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
    [Route("payment")]
    [ApiController]
    public class paymentsController : ControllerBase
    {
        private readonly paymentsystemContext _context;

        public paymentsController(paymentsystemContext context)
        {
            _context = context;
        }

        // GET: api/payments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<payment>>> Getpayment()
        {
            return await _context.payment.ToListAsync();
        }

        // GET: api/payments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<payment>> Getpayment(int id)
        {
            var payment = await _context.payment.FindAsync(id);

            if (payment == null)
            {
                return NotFound();
            }

            return payment;
        }

        // PUT: api/payments/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> Putpayment(int id, payment payment)
        {
            if (id != payment.id_payment)
            {
                return BadRequest();
            }

            _context.Entry(payment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!paymentExists(id))
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

        // POST: payment/add
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        [Route("add")]
        public async Task<ActionResult<payment>> Postpayment([FromBody] payment payment, [FromHeader] string api_token)
        {
            AuthController newAuth = new AuthController(_context);
            var ActionResult = await newAuth.getId(api_token);
            var OkObjectResult = ActionResult as OkObjectResult;

            int status = 0;
            string rejection_reason = null;

            int UserId = (int)OkObjectResult.Value;
            //при проведении платежа добавить его в истроию
            //если на счету не хватает декнег отменяем платеж и меняем статус
            //если хватает списываем деньги, добавляем деньги и меняем статус платежа
            _context.payment.Add(payment);         
            await _context.SaveChangesAsync();

            if (_context.Acc.Any(x => x.id_acc == payment.sender_id && x.balance_acc >= payment.sum))
            {
                status = 1;
                //Списать
                var AccSenderBalanceUpdate = _context.Acc.Where(x => x.id_acc == payment.sender_id).ToList();
                AccSenderBalanceUpdate[0].balance_acc -= payment.sum;
                await _context.SaveChangesAsync();
                //добавить
                var AccRecipientBalanceUpdate = _context.Acc.Where(x => x.id_acc == payment.recipient_id).ToList();
                AccRecipientBalanceUpdate[0].balance_acc += payment.sum;
                await _context.SaveChangesAsync();
            }
            else
            {
                status = 2;
                rejection_reason = "Недостаточно средств на счету!";
            }

            payment_historyController PaymentHistory = new payment_historyController(_context);
            payment_history new_payment = new payment_history
            {
                payment_id = payment.id_payment,
                status_payment_id = status,
                date_check = DateTime.Now,
                rejection = rejection_reason
            };
            await PaymentHistory.Postpayment_history(new_payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getpayment", new { id = payment.id_payment }, payment);
        }

        [HttpGet]
        [Route("history")]
        public async Task<ActionResult<IEnumerable<payment_history>>> GetpaymentHistory()
        {
            payment_historyController PaymentHistory = new payment_historyController(_context);
            return await PaymentHistory.Getpayment_history();
        }


        // DELETE: api/payments/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<payment>> Deletepayment(int id)
        {
            var payment = await _context.payment.FindAsync(id);
            if (payment == null)
            {
                return NotFound();
            }

            _context.payment.Remove(payment);
            await _context.SaveChangesAsync();

            return payment;
        }

        private bool paymentExists(int id)
        {
            return _context.payment.Any(e => e.id_payment == id);
        }
    }
}
