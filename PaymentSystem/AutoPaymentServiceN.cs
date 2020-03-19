using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PaymentSystem.Models;

namespace AutoPaymentServiceN
{
    internal class AutoPaymentService : IHostedService, IDisposable
    {
        private readonly ILogger _logger;
        private Timer _timer;
        private readonly IServiceScopeFactory scopeFactory;
        private int _errorCounts;
        public AutoPaymentService(ILogger<AutoPaymentService> logger, IServiceScopeFactory scopeFactory)
        {
            _logger = logger;
            this.scopeFactory = scopeFactory;
            this._errorCounts = 0;
        }
        public Task StartAsync(CancellationToken cancellationToken)
        {
            //сервис обрабатывает запросы каждую секунду
            _timer = new Timer(CheckAllPayments, null, TimeSpan.Zero,
                TimeSpan.FromSeconds(10));
            return Task.CompletedTask;
        }
        private void CheckAllPayments(object state)
        {
            using (var scope = scopeFactory.CreateScope())
            {
                var _context = scope.ServiceProvider.GetRequiredService<paymentsystemContext>();
                var payments = _context.autopayment.ToList();
                if (payments.Count > 0)
                {
                    foreach (var t in payments)
                    {
                        if (t.freezing == false)
                        {
                            var sender = _context.Acc.Where(x => x.id_acc == t.sender_id).FirstOrDefault();
                            var recipient = _context.Acc.Where(x => x.id_acc == t.recipient_id).FirstOrDefault();
                            if (sender != null && recipient != null && sender.status_acc_id != 2 && recipient.status_acc_id != 2)
                            {
                                var autopayment_range = t.autopayment_range_;
                                if (autopayment_range != null)
                                {
                                    int duration = (int)autopayment_range.periodicity;
                                    if (t.date_payment != null)
                                    {
                                        /*
                                         * проверка баланса отправителя(способность отправки денег), даты отправки, 
                                         * периодичности (в моем случае - сколько раз должно совершиться)
                                        */
                                        bool everyThingIsOkey =
                                            t.date_payment == DateTime.Today &&
                                            t.autopayment_range_.periodicity > 0 &&
                                            t.sum <= t.sender_.balance_acc - t.sum ? true : false;

                                        /*
                                         * Если на счету недостаточно средств и автоплатеж не заблокирован, то блокируем автоплатеж
                                         */
                                        bool lessMoney =
                                            t.date_payment == DateTime.Today &&
                                            t.autopayment_range_.periodicity > 0 &&
                                            t.sum >= t.sender_.balance_acc - t.sum ? true : false;

                                        if (everyThingIsOkey)
                                        {

                                            autopayment autopayment = _context.autopayment.Find(t.id_autopayment);
                                            autopayment.sender_.balance_acc -= t.sum;
                                            autopayment.autopayment_range_.periodicity--;
                                            autopayment.recipient_.balance_acc += t.sum;


                                            payment p = new payment();
                                            p.recipient_ = recipient;
                                            p.sender_ = sender;
                                            p.sum = t.sum;
                                            p.comm = "Деньги отправлены автоплатежом.";


                                            _context.payment.Add(p);

                                            int idPayment = p.id_payment;
                                            payment_history new_payment = new payment_history
                                            {
                                                payment_id = idPayment,
                                                status_payment_id = 1,
                                                date_check = DateTime.Now,
                                                rejection = null
                                            };
                                            _context.payment_history.Add(new_payment);
                                            _context.SaveChanges();
                                        }
                                        else if (lessMoney)
                                        {
                                            autopayment autopayment = _context.autopayment.Find(t.id_autopayment);
                                            autopayment.freezing = true;
                                            autopayment.comm = "Автоплатеж не может быть реализован по причине нехватки денежных средств.";
                                            _context.SaveChanges();
                                        }
                                        else
                                        {
                                            string error = String.Format("Что-то пошло не так с валидностью данных пользователей. Автоплатеж - {0}, дата - {1}", t.id_autopayment, t.date_payment.ToString("d"));
                                        }
                                    }
                                }
                                else
                                {
                                    string error = String.Format("Не заполнено поле периодичности автоплатежей. Автоплатеж - {0}, дата - {1}", t.id_autopayment, t.date_payment.ToString("d"));
                                    _LogError(error);
                                }
                            }
                            else
                            {
                                string error = String.Format("В ходе выполнения автоплатежей у пользователей возникли проблемы. Автоплатеж - {0}, дата - {1}", t.id_autopayment, t.date_payment.ToString("d"));
                                _LogError(error);
                            }
                        }
                    }
                }
                else
                {
                    string error = String.Format("В системе нет автоплатежей");
                    _LogError(error);
                }
            }
            
            _logger.LogInformation("Сервис автоплатежей запущен. Ошибок с автоплатежами - " + this._errorCounts.ToString());
        }
        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }
        public void Dispose()
        {
            _timer?.Dispose();
        }
        private void _LogError(string error)
        {
            this._errorCounts++;
            _logger.LogInformation(error);
        }
    }
}