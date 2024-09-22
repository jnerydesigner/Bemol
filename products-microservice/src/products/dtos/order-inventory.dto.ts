import { OrderStatusEnum } from "../enum/order_status.enum";

export interface OrderInventoryDTO {
    orderId: string,
    productId: string,
    message: string,
    quantity: number,
    status: OrderStatusEnum
}