import { randomUUID } from 'node:crypto';

export class ProductsCartEntity {
  constructor(
    readonly productId: string,
    readonly name: string,
    readonly price: number,
    readonly quantity: number = 0,
    readonly orderId: string,
  ) {}

  static createProduct(
    name: string,
    price: number,
    orderId: string,
    quantity: number,
  ): ProductsCartEntity {
    const productId = randomUUID();

    return new ProductsCartEntity(productId, name, price, quantity, orderId);
  }
}
