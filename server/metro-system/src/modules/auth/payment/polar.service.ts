// polar.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Polar } from '@polar-sh/sdk';
import { Payment } from 'src/entities/payment.entity';
import { Ticket } from 'src/entities/ticket.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PolarService {
  private polar: Polar;

  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
  ) {
    this.polar = new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN,
      server: 'sandbox', // Crucial for dummy payments
    });
  }

  async createCheckout(suggestedAmount: number, userId: number, sourceId: number, destId: number) {
    const checkout = await this.polar.checkouts.create({
      products: ["6f47b781-cf57-4329-9d31-02a2d10371a2"],
      amount: Math.round(Number(suggestedAmount) * 100),
      successUrl: process.env.POLAR_SUCCESS_URL,
      metadata: { userId: userId.toString() }
    });

    // 1. Create a Pending Payment using the Checkout ID
    const payment = this.paymentRepo.create({
      userId,
      amount: suggestedAmount,
      status: 'pending',
      transactionRef: checkout.id, // Storing checkoutId here
    });
    await this.paymentRepo.save(payment);

    // 2. Create a Pending Ticket linked to that payment
    const ticket = this.ticketRepo.create({
      userId,
      paymentId: payment.id,
      sourceStationId: sourceId,
      destinationStationId: destId,
      status: 'pending_payment',
      farePaid: suggestedAmount,
    });
    await this.ticketRepo.save(ticket);

    return checkout;
  }
  async getPaymentStatus(transactionRef: string) {
    const payment = await this.paymentRepo.findOne({
      where: { transactionRef },
      relations: ['tickets', 'tickets.sourceStation', 'tickets.destinationStation']
    });

    if (!payment) throw new NotFoundException('Transaction not found');
    return payment;
  }
}