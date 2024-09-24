import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new ConfigService();
  const PORT_SERVER = config.get('PAYMENT_PORT');
  const logger = new Logger('PaymentMicroservice');


  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://bemol_rabbitmq:5672'],
      queue: 'payment_queue',
    },
  });


  await app.startAllMicroservices();

  await app.listen(PORT_SERVER, () => {
    logger.log(`Payment microservice is listening on port ${PORT_SERVER}`);
  });
}
bootstrap();
