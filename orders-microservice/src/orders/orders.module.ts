import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
const config = new ConfigService();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'INVENTORY_MICROSERVICE',
        transport: Transport.TCP,
        options: {
          port: 4504,
        },
      },
    ]),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
