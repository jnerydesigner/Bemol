import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { PaymentAdapter } from "./interface/payment-adapter.interface";
import { firstValueFrom } from "rxjs";
import { OrderPaymentCreatedDTO, ResolvePaymentAdapterDTO } from "./dtos/order-payment-created.dto";
import { PaymentsStatusEnum } from "./enums/payments-status.enum";
import { PaymentsEntity } from "./entities/payments.entiry";

export class PaymentGatewayFakeAdapter implements PaymentAdapter {
    constructor(private readonly httpService: HttpService,
        private readonly configService: ConfigService) {

    }
    async resolvePayment(data: any): Promise<ResolvePaymentAdapterDTO> {
        return data

    }
    async processPayment(payment: any) {
        await firstValueFrom(this.httpService.post(`${this.configService.get<string>("PAYMENT_GATEWAY_URL")}/payment/process`, payment));
    }
}