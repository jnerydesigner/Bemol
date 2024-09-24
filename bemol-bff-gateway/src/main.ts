import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();
  const PORT = config.get<number>('BFF_PORT');
  const logger = new Logger('BFF MAIN');
  await app.listen(PORT, () => {
    logger.log(`BFF is running on: http://localhost:${PORT}`);
  });
}
bootstrap();

