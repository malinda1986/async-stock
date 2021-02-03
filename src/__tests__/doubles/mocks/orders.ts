import faker from 'faker';

import { Order, OrderCreation } from '@/domain/models';
import { productMock } from '@/__tests__/doubles/mocks';

export const orderCreationMock: OrderCreation = {
  products: [productMock, productMock],
};

export const orderMock: Order = {
  id: faker.random.uuid(),
  products: [productMock, productMock],
  total: faker.random.number(),
};
