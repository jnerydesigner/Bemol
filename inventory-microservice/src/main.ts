import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new ConfigService();
  const PORT_SERVER = config.get<number>('INVENTORY_PORT');
  const PORT_SERVER_MICROSERVICE = config.get<number>(
    'INVENTORY_PORT_MICROSERVICE',
  );
  const logger = new Logger('Main Inventory Microservice');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'inventory_queue',
    },
  });

  await app.startAllMicroservices();

  await app.listen(PORT_SERVER, () => {
    logger.log(`Inventory microservice is listening on port ${PORT_SERVER}`);
  });
}
bootstrap();
