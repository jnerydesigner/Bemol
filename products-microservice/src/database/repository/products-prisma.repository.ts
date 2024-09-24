import { ProductsRepository } from '@app/products/repository/products.repository';
import { PrismaService } from '../client/prisma.service';
import { ProductsEntity } from '@app/products/entities/products.entity';

export class ProductsPrismaRepository implements ProductsRepository {
  constructor(private readonly prisma: PrismaService) { }
  async findById(productId: string): Promise<any> {
    const product = await this.prisma.products.findFirst({
      where: {
        productId: productId,
      },
    });


    return product;

  }

  async save(product: ProductsEntity): Promise<ProductsEntity> {
    const productSaved = await this.prisma.products.create({
      data: {
        name: product.getName(),
        price: Number(product.getPrice()),
      },
    });

    return new ProductsEntity(
      productSaved.productId,
      productSaved.name,
      productSaved.price,
    );
  }
  async findByProductName(productName: string): Promise<ProductsEntity> {
    const product = await this.prisma.products.findFirst({
      where: {
        name: productName,
      },
    });

    if (!product) {
      return null;
    }

    return new ProductsEntity(
      product.productId,
      product.name,
      product.price,
    );
  }

  async findAll(): Promise<ProductsEntity[]> {
    const products = await this.prisma.products.findMany();
    return products.map(
      (product) =>
        new ProductsEntity(
          product.productId,
          product.name,
          product.price,
        ),
    );
  }

  async update(
    product: ProductsEntity
  ): Promise<ProductsEntity> {
    const update = await this.prisma.products.update({
      data: {
        name: product.getName(),
        price: product.getPrice(),
      },
      where: {
        productId: product.getProductId(),
      },
    });

    return new ProductsEntity(
      update.productId,
      update.name,
      update.price,
    );
  }
}
