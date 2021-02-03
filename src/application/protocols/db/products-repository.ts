import { DbProduct, Product } from '@/domain/models';

export interface ProductsRepository {
  createMany: (products: Product[]) => Promise<Product[]>;
  findByName: (productName: string) => Promise<DbProduct | undefined>;
  update: (product: DbProduct) => Promise<DbProduct>;
}
