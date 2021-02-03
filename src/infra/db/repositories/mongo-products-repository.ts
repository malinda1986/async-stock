import { getMongoRepository, MongoRepository } from 'typeorm';

import { ProductsRepository } from '@/application/protocols';
import { Product } from '@/domain/models';
import { ProductEntity } from '@/infra/db/entities';
import { AbstractMongoRepository } from './abstract-mongo-repository';

export class MongoProductsRepository
  extends AbstractMongoRepository<ProductEntity>
  implements ProductsRepository {
  private repository: MongoRepository<ProductEntity>;

  constructor() {
    super();
    this.repository = getMongoRepository(ProductEntity);
  }

  async findByName(productName: string): Promise<Product | undefined> {
    const product = await this.repository.findOne({
      name: productName.replace(`"`, '').replace(`"`, ''),
    });

    if (!product) {
      return undefined;
    }

    return this.withoutIdAndTimestamps(product);
  }

  async createMany(products: Product[]): Promise<Product[]> {
    const createdProducts = this.repository.create(products);
    return this.repository.save(createdProducts);
  }

  async update(product: Product): Promise<void> {
    await this.repository.save(product);
  }
}
