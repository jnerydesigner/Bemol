import { Inject, Injectable } from '@nestjs/common';
import { OrderRequestCreateDTO } from './dto/orders-request.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderEvent } from './events/create-order.event';
import { OrdersRepository } from './repository/orders.repository';
import { OrdersEntity } from './entities/orders.entity';
import { ProductsCartEntity } from './entities/products-cart.entity';
import { randomUUID } from 'node:crypto';
import { OrderInventoryConfirmedDTO } from './dto/order-inventory-confirmed.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('INVENTORY_MICROSERVICE')
    private readonly rabbitClient: ClientProxy,
    @Inject('ORDERS_REPOSITORY')
    private readonly ordersRepository: OrdersRepository,
    @Inject('PRODUCTS_MICROSERVICE')
    private readonly productsBroker: ClientProxy,
    @Inject('PAYMENTS_MICROSERVICE')
    private readonly paymentsBroker: ClientProxy,
  ) { }

  async emitOrder(order: OrderRequestCreateDTO) {
    const orderCreate = OrdersEntity.create(
      order.userId,
      order.products,
      order.orderId,
    );


    const orderCreated = await this.ordersRepository.save(orderCreate);
    this.productsBroker.emit('product_find_orders', orderCreated);
  }

  async calculateOrder(data: OrderRequestCreateDTO) {
    const order = OrdersEntity.create(data.userId, data.products, data.orderId);

    await this.ordersRepository.save(order);
  }

  async findAllOrders() {
    return this.ordersRepository.findAll();
  }

  async orderInventoryCancelled(data: any) {
    await this.ordersRepository.cancelledOrder(data.orderId);
  }

  async orderInventoryConfirmed(data: OrderInventoryConfirmedDTO) {
    const inventoryOrder = await this.ordersRepository.confirmedOrder(data);
    console.log(inventoryOrder);

    this.paymentsBroker.emit('payment_create', inventoryOrder);


  }

  async handleOrderPaymentUpdate(data: any) {
    await this.ordersRepository.updateOrderPayment(data)
    console.log(data);
  }
}
