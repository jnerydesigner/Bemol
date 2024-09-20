import { Global, Module } from '@nestjs/common';
import { PrismaService } from './client/prisma.service';
import { OrdersPrismaRepository } from './repository/orders-prisma.repository';
import { UsersPrismaRepository } from './repository/user-prisma.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: 'ORDERS_REPOSITORY',
      useFactory: (prisma: PrismaService) => {
        return new OrdersPrismaRepository(prisma);
      },
      inject: [PrismaService],
    },
    {
      provide: 'USERS_REPOSITORY',
      useFactory: (prisma: PrismaService) => {
        return new UsersPrismaRepository(prisma);
      },
      inject: [PrismaService],
    },
  ],
  exports: [PrismaService, 'ORDERS_REPOSITORY', 'USERS_REPOSITORY'],
})
export class DatabaseModule {}
