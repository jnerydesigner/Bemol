export interface PaymentRepository {
    savePayment(payment: any): Promise<void>;
}