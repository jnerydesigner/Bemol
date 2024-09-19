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
  const logger = new Logger('Main Orders Microservice');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: PORT_SERVER_MICROSERVICE,
    },
  });

  await app.startAllMicroservices();

  await app.listen(PORT_SERVER, () => {
    logger.log(`Inventory microservice is listening on port ${PORT_SERVER}`);
  });
}
bootstrap();
