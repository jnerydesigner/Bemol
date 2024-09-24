import { PaymentRepository } from "src/payments/repositories/payment.repository";
import { PrismaService } from "../client/prisma.service";

export class PaymentPrismaRepository implements PaymentRepository {
    constructor(private readonly prismaService: PrismaService) { }
    async savePayment(payment: any): Promise<void> {
        await this.prismaService.payments.create({
            data: {
                paymentId: payment.id,
                amount: Number(payment.total),
                currency: payment.currency,
                status: payment.status,
                transactionDate: payment.transactionDate,
                orderId: payment.orderId,
                description: "Pagamento vindo do Gateway"
            }
        })
    }

}