import { ResponseNotEnoughDTO } from "../dtos/response-not-enough.dto";
import { InventoryEntity } from "../entities/inventory.entity";

export interface InventoryRepository {
    saveInventory(productId: string, quantity: number): Promise<InventoryEntity>;
    getInventory(productId: string): Promise<void>;
    updateInventory(productId: string, quantity: number, orderId?: string, productName?: string): Promise<InventoryEntity | ResponseNotEnoughDTO>;
    deleteInventory(productId: string): Promise<void>;
    findAll(): Promise<InventoryEntity[]>;
    updateUniqueInventory(productId: string, quantity: number): Promise<any>;
}