import { PrismaService } from '@app/database/client/prisma.service';
import { OrderInventoryConfirmedDTO } from '@app/orders/dto/order-inventory-confirmed.dto';
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

  async confirmedOrder(data: OrderInventoryConfirmedDTO): Promise<any> {
    let countItens = 0;
    let subTotal = 0;
    let order = await this.prismaService.orders.findFirst({
      where: {
        orderId: data.orderId
      },
      include: {
        products: true
      }
    })


    const orderFind = data.products.map(async (product) => {
      countItens += product.quantity;
      subTotal += product.price * product.quantity;

      const productFind = await this.prismaService.productsCart.findFirst({
        where: {
          orderId: data.orderId
        }
      })

      const updatedCart = await this.prismaService.productsCart.update({
        data: {
          price: product.price,
          name: product.name,
          quantity: product.quantity
        },
        where: {
          productCartId: productFind.productCartId
        }
      })

      return updatedCart

    })

    const produtcPromiseUpdated =
      await Promise.all(orderFind);


    order = await this.prismaService.orders.findFirst({
      where: {
        orderId: data.orderId
      },
      include: {
        products: true
      }
    })

    await this.prismaService.orders.update({
      data: {
        status: data.status,
        total: subTotal,
        quantity: countItens
      },
      where: {
        orderId: order.orderId
      },
      include: {
        products: true
      }
    })

    const orderFindNew = await this.prismaService.orders.findFirst({
      where: {
        orderId: data.orderId
      },
      include: {
        products: true
      }
    })

    return orderFindNew
  }

  async updateOrderPayment(data: any): Promise<void> {
    await this.prismaService.orders.update({
      data: {
        status: data.status
      },
      where: {
        orderId: data.orderId
      }
    })
  }

}
