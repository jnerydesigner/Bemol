import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderRequestCreateDTO } from './dto/orders-request.dto';
import { EventPattern } from '@nestjs/microservices';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  emitOrder(@Body() orderCreate: any) {
    return this.ordersService.emitOrder(orderCreate);
  }

  @Get()
  findAllOrders() {
    return this.ordersService.findAllOrders();
  }

  @EventPattern('order_cart_products')
  handleCartOrdersProducst(data: OrderRequestCreateDTO) {
    this.ordersService.calculateOrder(data);
  }

  @EventPattern('order_inventory_cancelled')
  nadleOrderInventoryCancelled(data: any) {
    this.ordersService.orderInventoryCancelled(data);
  }
}
