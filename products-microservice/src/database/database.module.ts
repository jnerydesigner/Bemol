import { Global, Module } from '@nestjs/common';
import { PrismaService } from './client/prisma.service';
import { ProductsPrismaRepository } from './repository/products-prisma.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: 'PRODUCTS_REPOSITORY',
      useFactory: (prisma: PrismaService) => {
        return new ProductsPrismaRepository(prisma);
      },
      inject: [PrismaService],
    },
  ],
  exports: [PrismaService, 'PRODUCTS_REPOSITORY'],
})
export class DatabaseModule {}
