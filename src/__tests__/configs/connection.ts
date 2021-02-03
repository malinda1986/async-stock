import { createConnection, getConnection } from 'typeorm';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';

const mongoMemory = new MongoMemoryServer();

export const connection = {
  async create(): Promise<void> {
    const port = await mongoMemory.getPort();
    const database = await mongoMemory.getDbName();

    await createConnection({
      type: 'mongodb',
      port,
      database,
      useUnifiedTopology: true,
      entities: [path.join(__dirname, '..', '..', 'infra', 'db', 'entities/*.ts')],
    });
  },

  async close(): Promise<void> {
    await getConnection().close();
  },

  async clear(): Promise<void> {
    const connectionCreated = getConnection();
    const entities = connectionCreated.entityMetadatas;

    await Promise.all(
      entities.map(async (entity) => {
        const repository = connectionCreated.getMongoRepository(entity.name);
        const objects = await repository.find();
        if (objects?.length > 0) {
          await repository.remove(objects);
        }
      })
    );
  },
};

export const prepareConnection = (): void => {
  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.clear();
  });
};
