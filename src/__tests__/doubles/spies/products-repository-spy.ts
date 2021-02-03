import { ProductsRepository } from '@/application/protocols';
import { Product, DbProduct } from '@/domain/models';
import { dbProductMock, productMock } from '@/__tests__/doubles/mocks';

export class ProductsRepositorySpy implements ProductsRepository {
  async createMany(_products: Product[]): Promise<Product[]> {
    return [productMock, productMock];
  }

  async findByName(_productName: string): Promise<DbProduct | undefined> {
    return dbProductMock;
  }

  async update(_product: DbProduct): Promise<DbProduct> {
    return dbProductMock;
  }
}
