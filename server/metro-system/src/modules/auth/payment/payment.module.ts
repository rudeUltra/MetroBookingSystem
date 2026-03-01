import { Module } from "@nestjs/common";
import { PolarService } from "./polar.service";
import { PaymentController } from "./payment.controller";
import { WebhookController } from "./webhook.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "src/entities/payment.entity";
import { Ticket } from "src/entities/ticket.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Payment, Ticket])],
    controllers: [PaymentController, WebhookController],
    providers: [PolarService],
    exports: [PolarService]
})
export class PaymentModule { }
