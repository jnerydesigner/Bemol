import { Injectable } from '@nestjs/common';
import { CreateOrderEvent } from './events/create-order.event';

@Injectable()
export class OrdersService {
  handleOrderCreated(data: { status: string }) {
    console.log('handleOrderCreated', data);
  }
}
