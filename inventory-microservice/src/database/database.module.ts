import { Global, Module } from '@nestjs/common';
import { PrismaService } from './client/prisma.service';

@Global()
@Module({
    providers: [PrismaService]
})
export class DatabaseModule {}
