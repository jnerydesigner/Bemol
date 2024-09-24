import { Global, Module } from '@nestjs/common';
import { PaymentPrismaRepository } from './repositories/payment-prisma.repository';
import { PrismaService } from './client/prisma.service';

@Global()
@Module({
    providers: [PrismaService, {
        provide: 'PAYMENT_REPOSITORY',
        useFactory: (prisma: PrismaService) => {
            return new PaymentPrismaRepository(prisma)
        },
        inject: [PrismaService]
    }],
    exports: ['PAYMENT_REPOSITORY']
})
export class DatabaseModule { }
