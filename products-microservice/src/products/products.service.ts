import { Inject, Injectable } from '@nestjs/common';
import { ProductsRepository } from './repository/products.repository';
import { MinioClientService } from '@app/upload-files/minio-client.service';
import { BufferedFile } from '@app/upload-files/file.model';
import { CropImageHelper } from '@app/upload-files/helper/image-crop.helper';
import { ProductsCreateDTO } from './dtos/product-create.dto';
import { ProductsEntity } from './entities/products.entity';
import { randomUUID } from 'node:crypto';
import { ProductsOrdersDTO } from './dtos/products-orders.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCTS_REPOSITORY')
    private readonly productsRepository: ProductsRepository,
    private readonly uploadService: MinioClientService,
    @Inject('ORDERS_MICROSERVICE')
    private readonly ordersBroker: ClientProxy,
  ) {}

  async findAllProducts() {
    return this.productsRepository.findAll();
  }

  async createProduct(image: BufferedFile, productInput: ProductsCreateDTO) {
    const productSearch = await this.productsRepository.findByProductName(
      productInput.name,
    );

    if (productSearch) {
      const product = new ProductsEntity(
        productSearch.getProductId(),
        productSearch.getName(),
        productSearch.getPrice(),
        productSearch.getDescription(),
        productSearch.getImageUrl(),
      );

      const imageProduct = await this.imageProductUpload(image, product);

      const productResponse = await this.productsRepository.update(
        product,
        imageProduct,
      );

      return productResponse;
    }

    const productEntity = ProductsEntity.createProduct(
      productInput.name,
      productInput.price,
      productInput.description,
    );

    const imageProduct = await this.imageProductUpload(image, productEntity);
    productEntity.setImageUrl(imageProduct);

    const product = await this.productsRepository.save(productEntity);

    return new ProductsEntity(
      product.getProductId(),
      product.getName(),
      product.getPrice(),
      product.getDescription(),
      product.getImageUrl(),
    );
  }

  async imageProductUpload(image: BufferedFile, product: ProductsEntity) {
    const imageCropedHelper = await CropImageHelper.fromBuffer(
      image.buffer,
    ).cropToSquare();

    const imageCropedBuffer = await imageCropedHelper
      .resize(500, 500)
      .grayscale()
      .toBuffer();

    const imageRecroped = {
      buffer: imageCropedBuffer,
      ...image,
    };

    const productSearch = await this.productsRepository.findByProductName(
      product.getName(),
    );

    if (!productSearch || productSearch === null) {
      const { url } = await this.uploadService.uploadFile(
        product.getProductId(),
        imageRecroped,
      );

      return url;
    } else if (
      productSearch.getImageUrl() === null ||
      productSearch.getImageUrl() === undefined
    ) {
      const { url } = await this.uploadService.uploadFile(
        productSearch.getProductId(),
        imageRecroped,
      );

      return url;
    } else {
      const { url } = await this.uploadService.uploadFile(
        productSearch.getProductId(),
        imageRecroped,
      );

      await this.uploadService.deleteImage(productSearch.getImageUrl());

      return url;
    }
  }

  async handleProductFind(data: ProductsOrdersDTO) {
    const productsMapper = data.products.map(async (product) => {
      const productResponse = await this.productsRepository.findById(
        product.productId,
      );

      return {
        ...productResponse,
        price: productResponse.getPrice(),
        quantity: product.quantity,
      };
    });

    const products = await Promise.all(productsMapper);

    const productCart = {
      orderId: data.orderId,
      userId: data.userId,
      quantity: data.quantity,
      status: data.status,
      total: data.total,
      products,
    };

    this.ordersBroker.emit('order_cart_products', productCart);
  }
}
