import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [HttpModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
