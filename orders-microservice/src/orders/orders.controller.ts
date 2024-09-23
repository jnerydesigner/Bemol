import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderRequestCreateDTO } from './dto/orders-request.dto';
import { EventPattern } from '@nestjs/microservices';
import { OrderInventoryConfirmedDTO } from './dto/order-inventory-confirmed.dto';

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
  handleOrderInventoryCancelled(data: any) {
    this.ordersService.orderInventoryCancelled(data);
  }

  @EventPattern('order_inventory_confirmed')
  handleOrderInventoryConfirmed(data: OrderInventoryConfirmedDTO) {
    this.ordersService.orderInventoryConfirmed(data);
  }


  @EventPattern('order_payment_update')
  handleOrderPaymentUpdate(data: any) {
    this.ordersService.handleOrderPaymentUpdate(data);
  }
}
