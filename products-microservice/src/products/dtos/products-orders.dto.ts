export interface ProductsOrdersDTO {
  orderId: string;
  userId: string;
  quantity: number;
  status: string;
  total: any;
  products: Product[];
}

export interface Product {
  productId: string;
  quantity: number;
  orderId: string;
}
