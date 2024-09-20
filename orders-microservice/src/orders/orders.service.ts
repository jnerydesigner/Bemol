import { Inject, Injectable } from '@nestjs/common';
import { OrderRequestCreateDTO } from './dto/orders-request.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderEvent } from './events/create-order.event';
import { OrdersRepository } from './repository/orders.repository';
import { OrdersEntity } from './entities/orders.entity';
import { ProductsCartEntity } from './entities/products-cart.entity';
import { randomUUID } from 'node:crypto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('INVENTORY_MICROSERVICE')
    private readonly rabbitClient: ClientProxy,
    @Inject('ORDERS_REPOSITORY')
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async createOrder(order: OrderRequestCreateDTO) {
    const orderCreate = OrdersEntity.create(order.userId, order.products);

    await this.ordersRepository.save(orderCreate);

    return orderCreate;
  }

  async findAllOrders() {
    return this.ordersRepository.findAll();
  }
}
