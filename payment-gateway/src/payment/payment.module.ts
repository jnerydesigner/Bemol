import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentProcessService } from './payment-process.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  providers: [PaymentService, PaymentProcessService, ConfigService],
  controllers: [PaymentController]
})
export class PaymentModule { }
