import { DbProduct } from '@/domain/models';
import { ShowProduct } from '@/domain/usecases/products';
import { dbProductMock } from '@/__tests__/doubles/mocks';

export class ShowProductSpy implements ShowProduct {
  async show(_name: string): Promise<DbProduct> {
    return dbProductMock;
  }
}
