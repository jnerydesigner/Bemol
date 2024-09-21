import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();
  const PORT_SERVER = config.get<number>('PRODUCTS_PORT');
  const PORT_SERVER_MICROSERVICE = config.get<number>(
    'PRODUCTS_PORT_MICROSERVICE',
  );

  const logger = new Logger('Main Products Microservice');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'products_queue',
    },
  });

  await app.startAllMicroservices();

  await app.listen(PORT_SERVER, () => {
    logger.log(`Products microservice is listening on port ${PORT_SERVER}`);
  });
}
bootstrap();
