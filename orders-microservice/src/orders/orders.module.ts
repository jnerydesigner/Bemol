import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';



@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'INVENTORY_MICROSERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://bemol_rabbitmq:5672'],
          queue: 'inventory_queue',
        },
      },
      {
        name: 'PRODUCTS_MICROSERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://bemol_rabbitmq:5672'],
          queue: 'products_queue',
        },
      },
      {
        name: 'PAYMENTS_MICROSERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://bemol_rabbitmq:5672'],
          queue: 'payment_queue',
        },
      },
      {
        name: 'SENDMAIL_MICROSERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://bemol_rabbitmq:5672'],
          queue: 'sendmail_queue',
        },
      },
    ]),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule { }
