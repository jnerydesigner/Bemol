import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { OrderRequestCreateDTO } from './orders/dto/orders-request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  createOrder(@Body() orderCreate: OrderRequestCreateDTO) {
    return this.appService.createOrder(orderCreate);
  }
}
