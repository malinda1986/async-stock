export abstract class AbstractMongoRepository<T extends { createdAt?: Date; updatedAt?: Date }> {
  protected withoutTimestamps(entity: T): Omit<T, 'createdAt' | 'updatedAt'> {
    const { createdAt, updatedAt, ...restEntity } = entity;
    return restEntity;
  }
}
