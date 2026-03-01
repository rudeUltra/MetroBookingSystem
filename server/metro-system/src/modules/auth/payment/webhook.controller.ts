// webhook.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { Ticket } from 'src/entities/ticket.entity';
import { Repository } from 'typeorm';

@Controller('webhooks/polar')
export class WebhookController {
  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
  ) {}
  @Post()
async handleWebhook(@Body() payload: any) {
  if (payload.type === 'order.created') {
    const order = payload.data;
    const checkoutId = order.checkout_id; 

    // Find the record we created earlier
    const payment = await this.paymentRepo.findOne({ 
      where: { transactionRef: checkoutId },
      relations: ['tickets'] 
    });

    if (payment) {
      payment.status = 'completed';
      payment.tickets.forEach(ticket => {
        ticket.status = 'active';
        ticket.qrCodeToken = `TICKET-${order.id}-${Math.random().toString(36).toUpperCase().substring(2, 10)}`;
      });
      
      await this.paymentRepo.save(payment);
      await this.ticketRepo.save(payment.tickets);
    }
  }
  return { received: true };
}
}