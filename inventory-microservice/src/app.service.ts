import { Injectable } from '@nestjs/common';
import { CreateOrderEvent } from './orders/events/create-order.event';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  handleOrderCreated(data: CreateOrderEvent) {
    console.log('handleOrderCreated', data);
  }
}
