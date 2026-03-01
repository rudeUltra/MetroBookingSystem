// checkout.controller.ts
import { Controller, Post, Body, UseGuards, Req, Get, Param, NotFoundException } from '@nestjs/common';
import { PolarService } from './polar.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/entities/user.entity';
import { EntityManager } from 'typeorm';

@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentController {
  constructor(private readonly polarService: PolarService,
    private readonly entityManager: EntityManager,

  ) {}

  @Post('create-session')
  async createSession(@Req() req: any,@Body('amount') amount: number, @Body('sourceId') sourceId: number, @Body('destId') destId: number) {
    // 1. Fetch User ID from email (provided by JWT strategy)

    let user = await this.entityManager.findOne(User, { where: { email: req.user.email } });
    if(!user){
      throw new NotFoundException('User not found');
    }
    const checkout = await this.polarService.createCheckout(amount,user.id,sourceId,destId);

    //TODO Verify amount from DB
    
    // Return the URL for the frontend to redirect the user
    return { url: checkout.url };
  }
  @Get('status/:checkoutId')
  async getStatus(@Param('checkoutId') checkoutId: string) {
    return await this.polarService.getPaymentStatus(checkoutId);
  }
}