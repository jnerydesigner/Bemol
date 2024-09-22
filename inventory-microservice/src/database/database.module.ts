import { Global, Module } from '@nestjs/common';
import { PrismaService } from './client/prisma.service';
import { InventoryPrismaRepository } from './repository/inventory-prisma.repository';

@Global()
@Module({
    providers: [PrismaService, {
        provide: 'INVENTORY_REPOSITORY',
        useFactory: (prisma: PrismaService)=> {
            return new InventoryPrismaRepository(prisma);
        },
        inject:[PrismaService]
    }],
    exports: ['INVENTORY_REPOSITORY']
})
export class DatabaseModule {}
