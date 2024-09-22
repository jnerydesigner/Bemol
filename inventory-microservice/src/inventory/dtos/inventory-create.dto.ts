export interface InventoryCreateDTO {
    productId: string;
    quantity: number;
}
export interface InventoryUpdateDTO {
    productId: string;
    quantity: number;
    price: number;
    orderId: string;
    status?: string;
    productName?: string
}


