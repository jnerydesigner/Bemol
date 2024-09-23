import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentProcessDTO } from './payment-process.dto';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post('process')
    processPayment(@Body() paymentData: any) {
        const { amount, currency, orderId } = paymentData;
        const paymentResponse: PaymentProcessDTO = this.paymentService.processPayment(amount, currency, orderId);

        const webhookData = {
            event: 'payment.process',
            data: paymentResponse,
        };

        return webhookData;
    }
}

