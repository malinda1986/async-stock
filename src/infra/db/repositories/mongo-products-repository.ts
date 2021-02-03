import { getMongoRepository, MongoRepository } from 'typeorm';

import { ProductsRepository } from '@/application/protocols';
import { DbProduct, Product } from '@/domain/models';
import { ProductEntity } from '@/infra/db/entities';
import { AbstractMongoRepository } from './abstract-mongo-repository';
import { ObjectID } from 'mongodb';

export class MongoProductsRepository
  extends AbstractMongoRepository<ProductEntity>
  implements ProductsRepository {
  private repository: MongoRepository<ProductEntity>;

  constructor() {
    super();
    this.repository = getMongoRepository(ProductEntity);
  }

  async findByName(productName: string): Promise<DbProduct | undefined> {
    const product = await this.repository.findOne({
      where: { name: productName },
    });

    if (!product) {
      return undefined;
    }

    return this.withoutTimestamps(product);
  }

  async createMany(products: Product[]): Promise<Product[]> {
    const createdProducts = this.repository.create(products);
    return this.repository.save(createdProducts);
  }

  async update(product: Product & { id: string }): Promise<DbProduct> {
    const dbProduct = await this.repository.findOne(product.id);
    return this.repository.save({ ...dbProduct, ...product });
  }
}
