import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderRequestCreateDTO } from './dto/orders-request.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() orderCreate: OrderRequestCreateDTO) {
    return this.ordersService.createOrder(orderCreate);
  }
}
