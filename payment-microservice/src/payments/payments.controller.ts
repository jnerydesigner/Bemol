import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { OrderPaymentCreatedDTO } from './dtos/order-payment-created.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }
    @EventPattern('payment_create')
    handlerOrderPaymentCreated(data: OrderPaymentCreatedDTO) {
        this.paymentsService.handleCreatePayments(data);
    }

    @Post('process')
    processPaymentForWebHook(@Body() data: any) {
        this.paymentsService.handleAprovedPayment(data);
    }
}
