import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();

  const PORT_SERVER = config.get<number>('SEND_MAIL_PORT');

  const logger = new Logger('Main Send Mail Microservice');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://bemol_rabbitmq:5672'],
      queue: 'sendmail_queue',
    },
  });

  await app.startAllMicroservices();

  await app.listen(PORT_SERVER, () => {
    logger.log(`Send Mail microservice is listening on port ${PORT_SERVER}`);
  });
}
bootstrap();
