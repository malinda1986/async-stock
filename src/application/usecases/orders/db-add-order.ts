import { inject, injectable } from 'tsyringe';

import { OrderCreation, Order } from '@/domain/models';
import { AddOrder } from '@/domain/usecases/orders';
import { OrdersRepository } from '@/application/protocols';
import { ShowProduct } from '@/domain/usecases/products';
import { ApiError } from '@/domain/errors';
import { HttpStatusCode } from '@/presentation/protocols';

@injectable()
export class DbAddOrder implements AddOrder {
  constructor(
    @inject('ShowProduct')
    private readonly showProduct: ShowProduct,
    @inject('OrdersRepository')
    private readonly ordersRepository: OrdersRepository
  ) {}

  async add(order: OrderCreation): Promise<Order> {
    const { products } = order;

    const dbProducts = await Promise.all(
      products.map(async (product) => {
        const dbProduct = await this.showProduct.show(product.name);
        if (!dbProduct.quantity) {
          throw new ApiError(
            `Product ${product.name} is out of stock`,
            HttpStatusCode.unprocessableEntity
          );
        }
        return dbProduct;
      })
    );

    const total = dbProducts
      .map(({ price }) => price)
      .reduce((initialPrice, currentPrice) => initialPrice + currentPrice, 0);

    return this.ordersRepository.create({
      products: dbProducts,
      total,
    });
  }
}
