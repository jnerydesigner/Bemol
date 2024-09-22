import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderEvent } from './orders/events/create-order.event';
import { ClientProxy } from '@nestjs/microservices';

enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Injectable()
export class AppService {
  constructor(
    @Inject('PAYMENT_MICROSERVICE')
    private readonly paymentClient: ClientProxy,
  ) { }
  getHello(): string {
    return 'Hello World!';
  }

  handleOrderCreated(data: CreateOrderEvent) {
    this.paymentClient.emit('order_process', {
      status: OrderStatus.PENDING,
    });
  }
}
