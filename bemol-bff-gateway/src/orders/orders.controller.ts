import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './dtos/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Get()
  getOrders() {
    return this.ordersService.getAllOrders();
  }

  @Post()
  createOrder(@Body() data: CreateOrderDTO) {
    return this.ordersService.createOrder(data);
  }
}
