import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import { UploadFilesModule } from './upload-files/upload-files.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ProductsModule,
    DatabaseModule,
    UploadFilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
