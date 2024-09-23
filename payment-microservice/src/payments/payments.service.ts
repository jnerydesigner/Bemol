import { Inject, Injectable } from '@nestjs/common';
import { OrderPaymentCreatedDTO } from './dtos/order-payment-created.dto';
import { PaymentsEntity } from './entities/payments.entiry';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
    constructor(
        @Inject('ORDERS_MICROSERVICE')
        private readonly ordersBroker: ClientProxy,
        private readonly httpService: HttpService
    ) { }
    async handleCreatePayments(data: OrderPaymentCreatedDTO) {
        const payment = PaymentsEntity.createPayment(data.orderId, data.total, "BRL", "Pgamento de Compras");
        console.log('Payment Status', payment);

        await firstValueFrom(this.httpService.post('http://localhost:5555/payment/process', payment));
    }

    handleAprovedPayment(data: any) {
        this.ordersBroker.emit('order_payment_update', data);
    }
}
