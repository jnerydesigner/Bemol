export interface CreateOrderDTO {
    userId: string
    products: Product[]
}

export interface Product {
    productId: string
    quantity: number
}