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
    description: string,
    imageUrl?: string,
  ) {
    this.productId = productId;
    this.name = name;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  static createProduct(
    name: string,
    price: number,
    description: string,
  ): ProductsEntity {
    const productId = randomUUID();
    return new ProductsEntity(productId, name, price, description);
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

  setDescription(description: string) {
    this.description = description;
  }

  setProductId(productId: string) {
    this.productId = productId;
  }

  static fromObject(data: any): ProductsEntity {
    return new ProductsEntity(
      data.productId,
      data.name,
      data.price,
      data.description,
      data.imageUrl,
    );
  }
}
