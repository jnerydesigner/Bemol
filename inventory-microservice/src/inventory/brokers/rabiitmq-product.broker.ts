import { Inject, Injectable } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { BrokerInterface } from './broker.interface ';

@Injectable()
export class RabbitMQProductBroker implements BrokerInterface {
    constructor(@Inject('PRODUCTS_MICROSERVICE') private readonly productBroker: ClientProxy) { }

    emitEvent<T>(event: string, data: T): void {
        this.productBroker.emit(event, data);
    }
}