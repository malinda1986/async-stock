import { DbProduct, Product } from '@/domain/models';

import faker from 'faker';

export const dbProductMock: DbProduct = {
  id: faker.random.uuid(),
  name: faker.random.word(),
  price: faker.random.number(),
  quantity: faker.random.number(),
};

export const productMock: Product = {
  name: faker.random.word(),
  price: faker.random.number(),
  quantity: faker.random.number(),
};
