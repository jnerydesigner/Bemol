import { Inject, Injectable } from '@nestjs/common';
import { InventoryRepository } from './repository/inventory.repository';
import { ClientProxy } from '@nestjs/microservices';
import { InventoryDecrementDTO } from './dtos/inventory-decrement.dto';
import { OrderStatusEnum } from './enum/order_status.enum';

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

  async updateInventory(inventory: InventoryDecrementDTO) {

    const responseUpdateProducts = await this.inventoryRepository.productsUpdate(inventory.products);
    if (responseUpdateProducts.some(element => element.status === OrderStatusEnum.CANCELLED)) {

      const inventoryCancelled = {
        ...inventory,
        status: OrderStatusEnum.CANCELLED
      }
      this.productBroker.emit('inventory-updated', inventoryCancelled);
      return;
    }


    const responseInventory = {
      ...inventory,
      products: inventory.products
    }


    this.productBroker.emit('inventory-updated', responseInventory);
  }

  async updateInventoryUnic(productId: string, quantity: number) {
    const inventoryResponse = await this.inventoryRepository.updateUniqueInventory(productId, quantity);

    this.productBroker.emit<any>('inventory-updated', inventoryResponse);

  }
}
