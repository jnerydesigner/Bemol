import { ProductsEntity } from '../entities/products.entity';

export interface ProductsRepository {
  save(product: ProductsEntity): Promise<ProductsEntity>;
  findAll(): Promise<ProductsEntity[]>;
  findByProductName(productName: string): Promise<ProductsEntity>;
  update(product: ProductsEntity): Promise<ProductsEntity>;
  findById(productId: string): Promise<any>;
}
