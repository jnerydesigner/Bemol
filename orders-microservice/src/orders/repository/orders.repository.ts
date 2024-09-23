import { OrderInventoryConfirmedDTO } from '../dto/order-inventory-confirmed.dto';
import { OrdersEntity } from '../entities/orders.entity';

export interface OrdersRepository {
  save(order: any): Promise<any>;
  findAll(): Promise<OrdersEntity[]>;
  cancelledOrder(orderId: string): Promise<void>;
  confirmedOrder(data: OrderInventoryConfirmedDTO): Promise<void>;
  updateOrderPayment(data: any): Promise<void>;
}
