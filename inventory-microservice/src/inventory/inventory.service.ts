import { Inject, Injectable } from '@nestjs/common';
import { InventoryRepository } from './repository/inventory.repository';
import { InventoryUpdateDTO } from './dtos/inventory-create.dto';
import { BrokerInterface } from './brokers/broker.interface ';
import { RabbitMQProductBroker } from './brokers/rabiitmq-product.broker';
import { ClientProxy } from '@nestjs/microservices';
import { InventoryDecrementDTO } from './dtos/inventory-decrement.dto';

@Injectable()
export class InventoryService {
  constructor(
    @Inject('INVENTORY_REPOSITORY')
    private readonly inventoryRepository: InventoryRepository,

    @Inject('PRODUCTS_MICROSERVICE')
    private readonly productBroker: ClientProxy
  ) { }

  async saveInventory(productId: string, quantity: number) {
    return this.inventoryRepository.saveInventory(productId, quantity);
  }

  async findAll() {
    return this.inventoryRepository.findAll();
  }

  async updateInventory(inventory: InventoryDecrementDTO) {
    const inventoryArray = inventory.products.map(async (element) => {
      await this.inventoryRepository.updateInventory(element.productId, element.quantity, element.orderId, element.name, element.price);

      return element
    });

    const inventoryResponseArray = await Promise.all(inventoryArray);


    const responseInventory = {
      ...inventory,
      products: inventoryResponseArray
    }

    console.log(responseInventory);

    this.productBroker.emit('inventory-updated', responseInventory);
  }

  async updateInventoryUnic(productId: string, quantity: number) {
    const inventoryResponse = await this.inventoryRepository.updateUniqueInventory(productId, quantity);

    this.productBroker.emit<any>('inventory-updated', inventoryResponse);

  }
}
