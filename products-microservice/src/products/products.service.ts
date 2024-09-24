import { Inject, Injectable, Logger } from '@nestjs/common';
import { ProductsRepository } from './repository/products.repository';
import { MinioClientService } from '@app/upload-files/minio-client.service';
import { BufferedFile } from '@app/upload-files/file.model';
import { CropImageHelper } from '@app/upload-files/helper/image-crop.helper';
import { ProductsCreateDTO } from './dtos/product-create.dto';
import { ProductsEntity } from './entities/products.entity';
import { randomUUID } from 'node:crypto';
import { ProductsOrdersDTO } from './dtos/products-orders.dto';
import { ClientProxy } from '@nestjs/microservices';
import { OrderStatusEnum } from './enum/order_status.enum';
import { OrderInventoryDTO } from './dtos/order-inventory.dto';
import { InventoryUpdatedDTO } from './dtos/inventory-updated.dto';

@Injectable()
export class ProductsService {
  private logger: Logger = new Logger(ProductsService.name);
  constructor(
    @Inject('PRODUCTS_REPOSITORY')
    private readonly productsRepository: ProductsRepository,
    private readonly uploadService: MinioClientService,
    @Inject('ORDERS_MICROSERVICE')
    private readonly ordersBroker: ClientProxy,
    @Inject('INVENTORY_MICROSERVICE')
    private readonly inventoryBroker: ClientProxy,
  ) { }

  async findAllProducts() {
    this.logger.log('Buscando todos os produtos');
    return this.productsRepository.findAll();
  }

  async createProduct(productInput: ProductsCreateDTO) {
    const productSearch = await this.productsRepository.findByProductName(
      productInput.name,
    );

    if (productSearch) {
      const product = new ProductsEntity(
        productSearch.getProductId(),
        productSearch.getName(),
        productSearch.getPrice(),
      );


      const productResponse = await this.productsRepository.update(
        product
      );

      this.logger.log(`Produto: ${productResponse.getName()} atualizado`);
      return productResponse;
    }

    const productEntity = ProductsEntity.createProduct(
      productInput.name,
      productInput.price,
    );



    const product = await this.productsRepository.save(productEntity);

    this.logger.log(`Produto: ${product.getName()} criado`);

    return new ProductsEntity(
      product.getProductId(),
      product.getName(),
      product.getPrice(),
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

      this.logger.log(JSON.stringify(productResponse));

      return {
        ...productResponse,
        productId: product.productId,
        price: productResponse.price,
        quantity: product.quantity,
        orderId: data.orderId
      };
    });

    const products = await Promise.all(productsMapper);


    const productCart = {
      orderId: data.orderId,
      userId: data.userId,
      quantity: data.quantity,
      status: OrderStatusEnum.CONFIRMED,
      total: data.total,
      products,
    };


    this.inventoryBroker.emit('inventory_decrement', productCart);

  }


  async handleUpdateInventory(data: InventoryUpdatedDTO | OrderInventoryDTO) {
    switch (data.status) {
      case OrderStatusEnum.CONFIRMED:
        this.ordersBroker.emit('order_inventory_confirmed', data);
        break;
      case OrderStatusEnum.CANCELLED:
        this.ordersBroker.emit('order_inventory_cancelled', data);
        break;
    }
  }
}
