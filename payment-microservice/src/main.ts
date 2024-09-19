import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new ConfigService();
  const PORT_SERVER = config.get('PAYMENT_PORT');
  const PORT_PAYMENT_MICROSERVICE = config.get('PORT_PAYMENT_MICROSERVICE');
  const logger = new Logger('PaymentMicroservice');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: PORT_PAYMENT_MICROSERVICE,
    },
  });

  await app.startAllMicroservices();

  await app.listen(PORT_SERVER, () => {
    logger.log(`Payment microservice is listening on port ${PORT_SERVER}`);
  });
}
bootstrap();
