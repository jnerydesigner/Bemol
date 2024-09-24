import { randomUUID } from "node:crypto";
import { PaymentsStatusEnum } from "../enums/payments-status.enum";

export class PaymentsEntity {
    constructor(readonly paymentId: string, readonly orderId: string, readonly amount: number, readonly currency: string, readonly description: string, readonly statusPayment: string, readonly transactionDate: Date) { }

    static createPayment(orderId: string, amount: number, currency: string, description: string) {
        const paymentId = randomUUID();
        const status = PaymentsStatusEnum.PENDING
        return new PaymentsEntity(paymentId, orderId, amount, currency, description, status, new Date());
    }
}