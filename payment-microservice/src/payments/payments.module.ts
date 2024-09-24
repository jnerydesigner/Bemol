import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule, HttpService } from '@nestjs/axios';
import { PaymentGatewayFakeAdapter } from './payment-gateway.adapter';
import { ConfigService } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [HttpModule, DatabaseModule, ClientsModule.register([
    {
      name: 'ORDERS_MICROSERVICE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://bemol_rabbitmq:5672'],
        queue: 'orders_queue',
      },
    },
  ])],
  providers: [PaymentsService, {
    provide: 'PAYMENT_GATEWAY_ADAPTER',
    useFactory: (httpService: HttpService, config: ConfigService) => {
      return new PaymentGatewayFakeAdapter(httpService, config)
    },
    inject: [HttpService, ConfigService]
  }],
  controllers: [PaymentsController]
})
export class PaymentsModule { }

