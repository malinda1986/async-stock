import { OrderCreation, Product } from '@/domain/models';
import { productMock } from '@/__tests__/doubles/mocks';

export class OrderCreationBuilder {
  private constructor(private products: Omit<Product, 'price'>[]) {}

  static aOrderCreation(): OrderCreationBuilder {
    return new OrderCreationBuilder([productMock, productMock]);
  }

  withQuantity(quantity: number): OrderCreationBuilder {
    this.products = this.products.map((product) => ({ ...product, quantity }));
    return this;
  }

  build(): OrderCreation {
    return {
      products: this.products,
    };
  }
}
