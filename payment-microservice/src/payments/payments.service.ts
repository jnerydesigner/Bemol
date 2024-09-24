import { Inject, Injectable, Logger } from '@nestjs/common';
import { OrderPaymentCreatedDTO } from './dtos/order-payment-created.dto';
import { PaymentsEntity } from './entities/payments.entiry';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PaymentAdapter } from './interface/payment-adapter.interface';
import { PaymentRepository } from './repositories/payment.repository';

@Injectable()
export class PaymentsService {
    private logger: Logger = new Logger(PaymentsService.name);
    constructor(
        @Inject('ORDERS_MICROSERVICE')
        private readonly ordersBroker: ClientProxy,
        @Inject('PAYMENT_GATEWAY_ADAPTER')
        private readonly paymentGatewayAdapter: PaymentAdapter,
        @Inject('PAYMENT_REPOSITORY')
        private readonly paymentRepository: PaymentRepository
    ) { }
    async handleCreatePayments(data: OrderPaymentCreatedDTO) {
        const payment = PaymentsEntity.createPayment(data.orderId, data.total, "BRL", "Pgamento de Compras");
        await this.paymentGatewayAdapter.processPayment(payment);

        this.logger.log(`Payment created for order ${data.orderId}`);

    }

    async handleAprovedPayment(data: any) {
        const response = await this.paymentGatewayAdapter.resolvePayment(data);

        await this.paymentRepository.savePayment(response);


        this.ordersBroker.emit('order_payment_update', response);

        this.logger.log(`Payment approved for order ${response.orderId}`);
    }
}
