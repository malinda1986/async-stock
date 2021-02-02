import { ObjectID } from 'mongodb';

export abstract class AbstractMongoRepository<
  T extends { id: string | ObjectID; createdAt?: Date; updatedAt?: Date }
> {
  protected withoutIdAndTimestamps(entity: T): Omit<T, 'createdAt' | 'updatedAt' | 'id'> {
    const { createdAt, updatedAt, id, ...restEntity } = entity;
    return restEntity;
  }

  protected withoutTimestamps(entity: T): Omit<T, 'createdAt' | 'updatedAt'> {
    const { createdAt, updatedAt, ...restEntity } = entity;
    return restEntity;
  }
}
