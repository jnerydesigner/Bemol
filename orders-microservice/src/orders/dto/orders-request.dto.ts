export interface OrderRequestCreateDTO {
  orderId: string;
  userId: string;
  quantity: number;
  status: string;
  total: number;
  products: ProductDTO[];
}

export interface ProductDTO {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  orderId: string;
}
