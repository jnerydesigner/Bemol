import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderEvent } from './orders/events/create-order.event';
import { OrderRequestCreateDTO } from './orders/dto/orders-request.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  private readonly orders = [];
  constructor(
    @Inject('INVENTORY_MICROSERVICE')
    private readonly inventoryClient: ClientProxy,
  ) {}

  createOrder(orderCreate: OrderRequestCreateDTO) {
    this.orders.push(orderCreate);
    this.inventoryClient.emit(
      'create_order',
      new CreateOrderEvent(
        orderCreate.userId,
        orderCreate.quantity,
        orderCreate.productId,
      ),
    );
    return orderCreate;
  }
}
