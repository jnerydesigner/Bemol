import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '@app/upload-files/file.model';
import { ProductsCreateDTO } from './dtos/product-create.dto';
import { EventPattern } from '@nestjs/microservices';
import { ProductsOrdersDTO } from './dtos/products-orders.dto';
import { InventoryUpdatedDTO } from './dtos/inventory-updated.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  async findAllProducts() {
    return this.productsService.findAllProducts();
  }

  @Post()
  async createProduct(
    @Body() body: ProductsCreateDTO,
  ) {
    return this.productsService.createProduct(body);
  }

  @EventPattern('product_find_orders')
  handlerproductsFind(data: ProductsOrdersDTO) {
    this.productsService.handleProductFind(data);
  }


  @EventPattern('inventory-updated')
  handlerInventory(data: InventoryUpdatedDTO) {
    this.productsService.handleUpdateInventory(data);
  }
}
