import { Inject, Injectable } from '@nestjs/common';
import { InventoryRepository } from './repository/inventory.repository';
import { InventoryUpdateDTO } from './dtos/inventory-create.dto';
import { BrokerInterface } from './brokers/broker.interface ';
import { RabbitMQProductBroker } from './brokers/rabiitmq-product.broker';
import { ClientProxy } from '@nestjs/microservices';

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

  async updateInventory(inventory: InventoryUpdateDTO) {
    let inventoryResponse = await this.inventoryRepository.updateInventory(inventory.productId, inventory.quantity, inventory.orderId, inventory.productName);

    inventoryResponse = {
      ...inventoryResponse,
      orderId: inventory.orderId,
      productName: inventory.productName,
    }

    this.productBroker.emit('inventory-updated', inventoryResponse);
  }

  async updateInventoryUnic(productId: string, quantity: number) {
    const inventoryResponse = await this.inventoryRepository.updateUniqueInventory(productId, quantity);

    this.productBroker.emit<any>('inventory-updated', inventoryResponse);

  }
}
