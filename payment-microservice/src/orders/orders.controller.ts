import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CreateOrderEvent } from './events/create-order.event';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @EventPattern('order_process')
  handlerOrderCreated(data: { status: string }) {
    this.ordersService.handleOrderCreated(data);
  }
}
