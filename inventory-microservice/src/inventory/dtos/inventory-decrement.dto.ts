export interface InventoryDecrementDTO {
    orderId: string
    userId: string
    quantity: number
    status: string
    total: number
    products: Product[]
}

export interface Product {
    productId: string
    name: string
    price: number
    description: string
    imageUrl: string
    createdAt: string
    updatedAt: string
    quantity: number
    orderId: string
}
