import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InventoryCreateDTO, InventoryUpdateDTO } from './dtos/inventory-create.dto';
import { InventoryService } from './inventory.service';
import { EventPattern } from '@nestjs/microservices';
import { InventoryDecrementDTO } from './dtos/inventory-decrement.dto';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }
    @Post()
    async saveInventory(@Body() body: InventoryCreateDTO) {
        return this.inventoryService.saveInventory(body.productId, body.quantity);
    }

    @Patch(":productId")
    async updateInventory(@Param("productId") productId: any, @Body() body: { quantity: number }) {
        return this.inventoryService.updateInventoryUnic(productId, body.quantity);
    }

    @EventPattern('inventory_decrement')
    async handleProductCreated(data: InventoryDecrementDTO) {
        console.log(data)
        this.inventoryService.updateInventory(data);
    }
}
