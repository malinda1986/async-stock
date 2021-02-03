import { DbProduct } from '@/domain/models';
import { dbProductMock } from '@/__tests__/doubles/mocks';

export class DbProductsBuilder {
  private constructor(private products: DbProduct[]) {}

  static aListOfProducts(products = [dbProductMock, dbProductMock]): DbProductsBuilder {
    return new DbProductsBuilder(products);
  }

  withQuantity(quantity: number): DbProductsBuilder {
    this.products = this.products.map((product) => ({ ...product, quantity }));
    return this;
  }

  withPrice(price: number): DbProductsBuilder {
    this.products = this.products.map((product) => ({ ...product, price }));
    return this;
  }

  build(): DbProduct[] {
    return this.products;
  }
}
