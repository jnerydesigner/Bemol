import { InventoryEntity } from "@app/inventory/entities/inventory.entity";
import { InventoryRepository } from "@app/inventory/repository/inventory.repository";
import { PrismaService } from "../client/prisma.service";
import { ResponseNotEnoughDTO } from "@app/inventory/dtos/response-not-enough.dto";
import { OrderStatusEnum } from "@app/inventory/enum/order_status.enum";

export class InventoryPrismaRepository implements InventoryRepository {
    constructor(private readonly prisma: PrismaService) { }


    async findAll(): Promise<InventoryEntity[]> {
        const inventories = await this.prisma.inventory.findMany();
        return inventories.map(inventory => new InventoryEntity(inventory.inventoryId, inventory.productId, inventory.quantity));
    }
    async saveInventory(productId: string, quantity: number): Promise<InventoryEntity> {
        const inventory = InventoryEntity.create(productId, quantity);

        const inventoryCreated = await this.prisma.inventory.create({
            data: {
                inventoryId: inventory.inventoryId,
                productId: inventory.productId,
                quantity: inventory.quantity,
            }
        });

        return new InventoryEntity(inventoryCreated.inventoryId, inventoryCreated.productId, inventoryCreated.quantity);
    }

    getInventory(productId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async updateInventory(productId: string, quantity: number, orderId?: string, productName?: string, productPrice?: number): Promise<InventoryEntity | ResponseNotEnoughDTO> {
        const inventory = await this.prisma.inventory.findFirst({
            where: {
                productId
            }
        })


        if (inventory.quantity - quantity < 0) {
            return {
                orderId: orderId,
                productId: inventory.productId,
                message: `Não temos o item: ${productName} da sua ordem em estoque`,
                quantity: quantity,
                status: OrderStatusEnum.CANCELLED,
                stock: inventory.quantity
            }
        }

        const updatedInventory = await this.prisma.inventory.update({
            where: {
                inventoryId: inventory.inventoryId
            },
            data: {
                quantity: inventory.quantity - quantity
            }
        });

        return new InventoryEntity(updatedInventory.inventoryId, updatedInventory.productId, quantity, orderId, OrderStatusEnum.CONFIRMED, productName, productPrice);
    }
    deleteInventory(productId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async updateUniqueInventory(productId: string, quantity: number): Promise<any> {
        const inventory = await this.prisma.inventory.findFirst({
            where: {
                productId
            }
        })

        inventory.quantity = inventory.quantity - quantity;



        if (inventory.quantity < 0) {
            return {
                productId: inventory.productId,
                message: "Não temos todos os itens de sua ordem em estoque",
                quantity: inventory.quantity,
                status: OrderStatusEnum.CANCELLED
            }
        }

        const updatedInventory = await this.prisma.inventory.update({
            where: {
                inventoryId: inventory.inventoryId
            },
            data: {
                quantity: inventory.quantity
            }
        });

        return new InventoryEntity(updatedInventory.inventoryId, updatedInventory.productId, updatedInventory.quantity);

    }

    async productsUpdate(products: any[]): Promise<any[]> {
        const inventoryArray = products.map(async (element) => {
            const inventory = await this.prisma.inventory.findFirst({
                where: {
                    productId: element.productId,
                }
            })

            if (inventory.quantity - element.quantity < 0) {
                return {
                    productId: inventory.productId,
                    message: "Não temos todos os itens de sua ordem em estoque",
                    quantity: inventory.quantity,
                    status: OrderStatusEnum.CANCELLED
                }
            }

            const inventoryUpdated = await this.prisma.inventory.update({
                where: {
                    inventoryId: inventory.inventoryId
                },
                data: {
                    quantity: inventory.quantity - element.quantity
                }
            });
            return inventoryUpdated;
        });

        const inventoryResponse = await Promise.all(inventoryArray);


        return inventoryResponse

    }


}