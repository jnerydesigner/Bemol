import { PrismaService } from '@app/database/client/prisma.service';
import { OrdersEntity } from '@app/orders/entities/orders.entity';
import { OrderStatusEnum } from '@app/orders/enum/order_status.enum';
import { OrdersRepository } from '@app/orders/repository/orders.repository';

export class OrdersPrismaRepository implements OrdersRepository {
  constructor(private readonly prismaService: PrismaService) { }

  async findAll(): Promise<OrdersEntity[]> {
    const orderResponse = await this.prismaService.orders.findMany({
      include: {
        products: true,
      },
    });
    const orders = orderResponse.map((order) => {
      return new OrdersEntity(
        order.orderId,
        order.userId,
        order.quantity,
        order.status,
        Number(order.total),
        order.products,
      );
    });

    return orders;
  }
  async save(order: OrdersEntity): Promise<OrdersEntity> {
    const [orderCreated, productCreated] =
      await this.prismaService.$transaction([
        this.prismaService.orders.create({
          data: {
            orderId: order.orderId,
            quantity: order.quantity,
            status: order.status,
            total: order.total,
            user: {
              connect: {
                userId: order.userId,
              },
            },
          },
        }),
        this.prismaService.productsCart.createMany({
          data: order.products.map((product) => {
            return {
              productId: product.productId,
              name: product.name,
              price: product.price,
              quantity: product.quantity,
              orderId: order.orderId,
            };
          }),
        }),
      ]);

    const productsResponse = await this.prismaService.orders.findFirst({
      where: {
        orderId: order.orderId,
      },
      include: {
        products: true,
      },
    });

    const total = Number(productsResponse.total);

    return new OrdersEntity(
      productsResponse.orderId,
      productsResponse.userId,
      productsResponse.quantity,
      productsResponse.status,
      total,
      productsResponse.products,
    );
  }

  async cancelledOrder(orderId: string): Promise<void> {


    await this.prismaService.orders.update({
      data: {
        status: OrderStatusEnum.CANCELLED
      },
      where: {
        orderId
      }
    })
  }
}
