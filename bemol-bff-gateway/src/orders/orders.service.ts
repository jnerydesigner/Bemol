import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(private readonly httpService: HttpService) {}

  async getAllOrders(): Promise<any[]> {
    const response = await firstValueFrom(
      this.httpService.get(`${process.env.ORDERS_MICROSERVICE_URL}/orders`),
    );

    return response.data;
  }
}
