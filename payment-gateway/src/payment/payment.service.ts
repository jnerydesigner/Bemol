import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PaymentProcessService } from './payment-process.service';
import { PaymentProcessDTO } from './payment-process.dto';
import { PaymentsStatusEnum } from './enums/payment-status.enum';

@Injectable()
export class PaymentService {
    constructor(private readonly paymentProcessService: PaymentProcessService) { }
    processPayment(amount: number, currency: string = 'BRL', orderId: string) {
        const paymentResponse: PaymentProcessDTO = {
            id: randomUUID(),
            total: amount,
            currency: currency,
            status: PaymentsStatusEnum.PENDING,
            transactionDate: new Date(),
            orderId
        };

        console.log('Payment received', paymentResponse);

        this.paymentProcessService.processPayment(paymentResponse);

        return paymentResponse;
    }
}

