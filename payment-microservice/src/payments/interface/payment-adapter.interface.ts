export interface PaymentAdapter {
    processPayment(payment: any): Promise<any>;
    resolvePayment(payment: any): Promise<any>;
}