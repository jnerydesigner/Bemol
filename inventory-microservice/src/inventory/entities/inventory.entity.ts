import { randomUUID } from "node:crypto";

export class InventoryEntity {
    constructor(readonly inventoryId: string, readonly productId: string, readonly quantity: number, readonly orderId?: string, readonly status?: string, readonly productName?: string) { }

    static create(productId: string, quantity: number) {
        const inventoryId = randomUUID();
        return new InventoryEntity(inventoryId, productId, quantity);
    }
}