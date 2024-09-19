import { Inject, Injectable } from '@nestjs/common';
import { OrderRequestCreateDTO } from './dto/orders-request.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderEvent } from './events/create-order.event';

@Injectable()
export class OrdersService {
  private readonly orders = [];
  constructor(
    @Inject('INVENTORY_MICROSERVICE')
    private readonly rabbitClient: ClientProxy,
  ) {}
  createOrder(orderCreate: OrderRequestCreateDTO) {
    this.orders.push(orderCreate);
    this.rabbitClient.emit(
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
