import { randomUUID } from 'node:crypto';

export class ProductsEntity {
  private imageUrl: string;
  private productId: string;
  private name: string;
  private price: number;
  private description: string;

  constructor(
    productId: string,
    name: string,
    price: number,

  ) {
    this.productId = productId;
    this.name = name;
    this.price = price;

  }

  static createProduct(
    name: string,
    price: number,
  ): ProductsEntity {
    const productId = randomUUID();
    return new ProductsEntity(productId, name, price);
  }

  setImageUrl(imageUrl: string) {
    this.imageUrl = imageUrl;
  }
  getImageUrl() {
    return this.imageUrl;
  }
  getProductId() {
    return this.productId;
  }

  getName() {
    return this.name;
  }

  getPrice() {
    return this.price;
  }

  getDescription() {
    return this.description;
  }

  setName(name: string) {
    this.name = name;
  }

  setPrice(price: number) {
    this.price = price;
  }


  static fromObject(data: any): ProductsEntity {
    return new ProductsEntity(
      data.productId,
      data.name,
      data.price,
    );
  }
}
