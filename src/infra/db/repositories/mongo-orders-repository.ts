import { getMongoRepository, MongoRepository } from 'typeorm';

import { OrdersRepository } from '@/application/protocols';
import { OrderCreation, Order } from '@/domain/models';
import { OrderEntity } from '@/infra/db/entities';
import { AbstractMongoRepository } from '@/infra/db/repositories';

export class MongoOrdersRepository
  extends AbstractMongoRepository<OrderEntity>
  implements OrdersRepository {
  private repository: MongoRepository<OrderEntity>;

  constructor() {
    super();
    this.repository = getMongoRepository(OrderEntity);
  }

  async all(): Promise<Order[]> {
    const orders = await this.repository.find();
    return orders.map(this.withoutTimestamps);
  }

  async create(order: OrderCreation & { total: number }): Promise<Order> {
    const created = this.repository.create(order);
    await this.repository.save(created);
    return this.withoutTimestamps(created);
  }

  async findById(orderId: string): Promise<Order | undefined> {
    const order = await this.repository.findOne(orderId);
    if (!order) {
      return undefined;
    }
    return this.withoutTimestamps(order);
  }
}
