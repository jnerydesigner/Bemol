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
  ) { }

  static create(
    userId: string,
    productsData: any[],
    orderIdInput?: string,
  ): OrdersEntity {
    const orderId = orderIdInput === undefined ? randomUUID() : orderIdInput;
    const status = OrderStatusEnum.PENDING;
    let quantityProductsInOrder: number = 0;
    let total = 0;
    const products = productsData.map((productData) => {
      const product = new ProductsCartEntity(
        productData.productId,
        '',
        0,
        productData.quantity,
        orderId,
      );
      total += product.price * product.quantity;
      quantityProductsInOrder += product.quantity;
      return product;
    });

    if (Number.isNaN(total)) {
      total = 0;
    }

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
