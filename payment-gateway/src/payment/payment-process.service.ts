import { Injectable } from "@nestjs/common";
import { PaymentProcessDTO } from "./payment-process.dto";
import { PaymentsStatusEnum } from "./enums/payment-status.enum";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PaymentProcessService {
    constructor(private readonly httpService: HttpService, private readonly config: ConfigService) { }
    async processPayment(data: PaymentProcessDTO) {
        const dataProcess = {
            ...data,
            status: PaymentsStatusEnum.APPROVED
        }

        setTimeout(async () => {
            console.log('Payment processed', dataProcess);
            await firstValueFrom(this.httpService.post('http://payment_microservice:4442/payments/process', dataProcess))
        }, this.config.get<number>('PAYMENT_PROCESS_DELAY'));

    }
}