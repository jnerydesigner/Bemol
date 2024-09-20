import { randomUUID } from 'node:crypto';
import { OrderStatusEnum } from '../enum/order_status.enum';
import { ProductsCartEntity } from './products-cart.entity';

export class OrdersEntity {
  constructor(
    readonly orderId: string,
    readonly userId: string,
    readonly quantity: number,
    readonly status: string,
    readonly total: number = 0,
    readonly products: ProductsCartEntity[],
  ) {}

  static create(userId: string, productsData: any[]): OrdersEntity {
    const orderId = randomUUID();
    const status = OrderStatusEnum.PENDING;
    let quantityProductsInOrder: number = 0;
    let total = 0;
    const products = productsData.map((productData) => {
      const product = ProductsCartEntity.createProduct(
        productData.name,
        productData.price,
        orderId,
        productData.quantity,
      );
      total += product.price * product.quantity;
      quantityProductsInOrder += product.quantity;
      return product;
    });

    return new OrdersEntity(
      orderId,
      userId,
      quantityProductsInOrder,
      status,
      total,
      products,
    );
  }
}
