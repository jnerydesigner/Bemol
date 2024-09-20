import { OrdersEntity } from '../entities/orders.entity';

export interface OrdersRepository {
  save(order: any): Promise<any>;
  findAll(): Promise<OrdersEntity[]>;
}
