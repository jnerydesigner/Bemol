import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';
import { MinioClientService } from './minio-client.service';
import { minioConfig } from './config/minio.config';

@Global()
@Module({
  imports: [
    ConfigModule,
    MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        endPoint: minioConfig.MINIO_ENDPOINT,
        port: minioConfig.MINIO_PORT,
        useSSL: false,
        accessKey: minioConfig.MINIO_ACCESSKEY,
        secretKey: minioConfig.MINIO_SECRETKEY,
        bucket: minioConfig.MINIO_BUCKET,
      }),
    }),
  ],
  controllers: [],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class UploadFilesModule {}
