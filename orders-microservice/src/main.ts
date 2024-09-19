import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();
  const PORT = config.get<number>('ORDERS_PORT');
  const logger = new Logger('Main Orders Microservice');
  await app.listen(PORT, () => {
    logger.log(`Orders Microservice is running on: ${PORT}`);
  });
}
bootstrap();
