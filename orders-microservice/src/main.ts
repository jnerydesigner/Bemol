import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();
  const PORT = config.get<number>('ORDERS_PORT');
  const logger = new Logger('Main Orders Microservice');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://bemol_rabbitmq:5672'],
      queue: 'orders_queue',
    },
  });

  await app.startAllMicroservices();

  await app.listen(PORT, () => {
    logger.log(`Orders Microservice is running on: ${PORT}`);
  });
}
bootstrap();
