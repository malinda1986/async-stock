import { inject, injectable } from 'tsyringe';

import { OrderCreation, Order, Product, DbProduct } from '@/domain/models';
import { AddOrder } from '@/domain/usecases/orders';
import { OrdersRepository, ProductsRepository } from '@/application/protocols';
import { ShowProduct } from '@/domain/usecases/products';
import { ApiError } from '@/domain/errors';
import { HttpStatusCode } from '@/presentation/protocols';

@injectable()
export class DbAddOrder implements AddOrder {
  constructor(
    @inject('ShowProduct')
    private readonly showProduct: ShowProduct,
    @inject('ProductsRepository')
    private readonly productsRepository: ProductsRepository,
    @inject('OrdersRepository')
    private readonly ordersRepository: OrdersRepository
  ) {}

  private async updateProductQuantity(
    product: Pick<Product, 'name' | 'quantity'>,
    dbProduct: DbProduct
  ): Promise<void> {
    if (!dbProduct.quantity || product.quantity > dbProduct.quantity) {
      throw new ApiError(
        `Product ${product.name} is out of stock`,
        HttpStatusCode.unprocessableEntity
      );
    }

    await this.productsRepository.update({
      ...dbProduct,
      quantity: dbProduct.quantity - product.quantity,
    });
  }

  private async getProduct(product: Pick<Product, 'name' | 'quantity'>): Promise<DbProduct> {
    const dbProduct = await this.showProduct.show(product.name);
    await this.updateProductQuantity(product, dbProduct);
    return dbProduct;
  }

  async add(order: OrderCreation): Promise<Order> {
    const { products } = order;

    const dbProducts = await Promise.all(
      products.map(async (product) => {
        const dbProduct = await this.getProduct(product);
        return { ...product, price: dbProduct.price };
      })
    );

    const total = dbProducts
      .map(({ price, quantity }) => price * quantity)
      .reduce((initialPrice, currentPrice) => initialPrice + currentPrice, 0);

    return this.ordersRepository.create({
      products: dbProducts.map(({ name, price, quantity }) => ({ name, price, quantity })),
      total,
    });
  }
}
