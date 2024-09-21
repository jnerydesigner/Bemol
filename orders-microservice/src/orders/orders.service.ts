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
    @Inject('PRODUCTS_MICROSERVICE')
    private readonly productsBroker: ClientProxy,
  ) {}

  async emitOrder(order: OrderRequestCreateDTO) {
    const orderCreate = OrdersEntity.create(
      order.userId,
      order.products,
      order.orderId,
    );

    this.productsBroker.emit('product_find_orders', orderCreate);

    // const orderCreate = OrdersEntity.create(order.userId, order.products);
    // await this.ordersRepository.save(orderCreate);
    // return orderCreate;
  }

  async calculateOrder(data: OrderRequestCreateDTO) {
    const order = OrdersEntity.create(data.userId, data.products, data.orderId);

    await this.ordersRepository.save(order);
  }

  async findAllOrders() {
    return this.ordersRepository.findAll();
  }
}
