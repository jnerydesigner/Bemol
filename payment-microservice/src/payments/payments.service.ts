import { Inject, Injectable } from '@nestjs/common';
import { OrderPaymentCreatedDTO } from './dtos/order-payment-created.dto';
import { PaymentsEntity } from './entities/payments.entiry';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
    constructor(
        @Inject('ORDERS_MICROSERVICE')
        private readonly ordersBroker: ClientProxy,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) { }
    async handleCreatePayments(data: OrderPaymentCreatedDTO) {
        const payment = PaymentsEntity.createPayment(data.orderId, data.total, "BRL", "Pgamento de Compras");
        console.log('Payment Status', payment);

        await firstValueFrom(this.httpService.post(`${this.configService.get<string>("PAYMENT_GATEWAY_URL")}/payment/process`, payment));
    }

    handleAprovedPayment(data: any) {
        this.ordersBroker.emit('order_payment_update', data);
    }
}
