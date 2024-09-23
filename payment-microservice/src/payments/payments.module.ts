import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ClientsModule.register([
    {
      name: 'ORDERS_MICROSERVICE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'orders_queue',
      },
    }
  ]), HttpModule],
  providers: [PaymentsService],
  controllers: [PaymentsController]
})
export class PaymentsModule { }
