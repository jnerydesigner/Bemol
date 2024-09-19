import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';
import { CreateOrderEvent } from './orders/events/create-order.event';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('create_order')
  handlerOrderCreated(data: CreateOrderEvent) {
    this.appService.handleOrderCreated(data);
  }
}
