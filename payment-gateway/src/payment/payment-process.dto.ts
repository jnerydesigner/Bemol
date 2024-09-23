export interface PaymentProcessDTO {
    id: string;
    orderId: string;
    total: number;
    currency: string;
    status: string;
    transactionDate: Date;
}