import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';

import * as crypto from 'crypto';
import { promisify } from 'util';
import { extname } from 'path';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { minioConfig } from './config/minio.config';
import { BufferedFile } from './file.model';

@Injectable()
export class MinioClientService {
  private readonly logger = new Logger(MinioClientService.name);
  private readonly baseBucket = 'bemol';
  private readonly s3Client: S3Client;

  constructor(private readonly minio: MinioService) {
    this.s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: minioConfig.MINIO_ENDPOINT_FULL,
      credentials: {
        accessKeyId: 'rwwhaLyks7polGaA',
        secretAccessKey: '02yesqBUpB3k6UrlgN8wzCSkCqszloAD',
      },
      forcePathStyle: true,
    });
  }

  private get client() {
    return this.minio.client;
  }

  async uploadFile(
    userId: string,
    file: BufferedFile,
    baseBucket: string = 'bemol',
  ) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException('Invalid file type', HttpStatus.BAD_REQUEST);
    }

    const uuidImage = crypto.randomUUID();
    const ext = extname(file.originalname);
    const filename = `${uuidImage}-${userId}${ext}`;

    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    };

    try {
      const putObjectCommand = new PutObjectCommand({
        Bucket: baseBucket,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      const response = await this.s3Client.send(putObjectCommand);
      this.logger.log(`Response ${JSON.stringify(response)}`);
      this.logger.log(`File ${filename} uploaded successfully`);

      return {
        url: `${baseBucket}/${filename}`,
      };
    } catch (err) {
      this.logger.error(`Error uploading file: ${err.message}`, err.stack);
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
    }
  }

  public async upload(
    userId: string,
    file: BufferedFile,
    baseBucket: string = this.baseBucket,
  ) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException('Invalid file type', HttpStatus.BAD_REQUEST);
    }

    const uuidImage = crypto.randomUUID();
    const ext = extname(file.originalname);
    const filename = `${uuidImage}-${userId}${ext}`;

    const fileBuffer = file.buffer;

    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    };

    try {
      const putObject = promisify(this.client.putObject.bind(this.client));
      await putObject(baseBucket, filename, fileBuffer, metaData);
      this.logger.log(`File ${filename} uploaded successfully`);

      return {
        url: `${baseBucket}/${filename}`,
      };
    } catch (err) {
      this.logger.error(`Error uploading file: ${err.message}`, err.stack);
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteImage(image: string, baseBucket: string = this.baseBucket) {
    try {
      const nameImage = image.split('/')[1];
      const headObjectCommand = new HeadObjectCommand({
        Bucket: baseBucket,
        Key: nameImage,
      });

      await this.s3Client.send(headObjectCommand);

      const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: baseBucket,
        Key: nameImage,
      });

      await this.s3Client.send(deleteObjectCommand);
      this.logger.log(`File ${nameImage} deleted successfully`);
      return {
        message: `File ${nameImage} deleted successfully`,
      };
    } catch (err) {
      if (err.name === 'NotFound') {
        this.logger.warn(`File ${image} not found`);
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }
      this.logger.error(`Error deleting file: ${err.message}`, err.stack);
      throw new HttpException('Error deleting file', HttpStatus.BAD_REQUEST);
    }
  }
}
