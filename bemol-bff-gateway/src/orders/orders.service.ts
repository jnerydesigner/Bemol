import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, firstValueFrom } from 'rxjs';
import { CreateOrderDTO } from './dtos/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly httpService: HttpService) { }

  async getAllOrders(): Promise<any[]> {
    const response = await firstValueFrom(
      this.httpService.get(`${process.env.ORDERS_MICROSERVICE_URL}/orders`),
    );

    return response.data;
  }

  async createOrder(data: CreateOrderDTO) {
    console.log(data)

    const response = await firstValueFrom(this.httpService.post(`${process.env.ORDERS_MICROSERVICE_URL}/orders`, data));

    console.log(response.data)

  }
}
