import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderRequestCreateDTO } from './dto/orders-request.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() orderCreate: any) {
    return this.ordersService.createOrder(orderCreate);
  }

  @Get()
  findAllOrders() {
    return this.ordersService.findAllOrders();
  }
}
