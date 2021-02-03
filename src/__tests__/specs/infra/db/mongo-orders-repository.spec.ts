import faker from 'faker';

import { OrderEntity } from '@/infra/db/entities';
import { MongoOrdersRepository } from '@/infra/db/repositories';
import { prepareConnection } from '@/__tests__/configs/connection';
import { orderWithouIdMock } from '@/__tests__/doubles/mocks';
import { seedOrder, seedOrders } from '@/__tests__/seeders';
import { getRepository } from 'typeorm';
import { Order } from '@/domain/models';

prepareConnection();

const sutFactory = (): MongoOrdersRepository => new MongoOrdersRepository();

const removeTimestamps = (order: OrderEntity): Order => {
  const { createdAt: _, updatedAt: __, ...without } = order;
  return without;
};

describe('MongoOrdersRepository', () => {
  describe('all', () => {
    it('should return an empty list if there is not any order in the database', async () => {
      const sut = sutFactory();
      const result = await sut.all();
      expect(result).toEqual([]);
    });
    it('should return all the orders from the database without timestamps', async () => {
      const sut = sutFactory();
      const orders = [orderWithouIdMock, orderWithouIdMock];
      const dbOrders = await seedOrders(orders);
      const result = await sut.all();
      const expected = dbOrders.map(removeTimestamps);
      expect(result).toEqual(expected);
    });
  });
  describe('create', () => {
    it('should create an order and return it', async () => {
      const sut = sutFactory();
      const ordersRepository = getRepository(OrderEntity);
      const order = { ...orderWithouIdMock, price: faker.random.number() };
      const result = await sut.create(order);
      expect(await ordersRepository.find()).toHaveLength(1);
      expect(result.products).toEqual(order.products);
      expect(result.total).toEqual(order.total);
      expect(result.id).toBeTruthy();
    });
  });
  describe('findById', () => {
    it('should throw an error if the provided id is invalid', async () => {
      const sut = sutFactory();
      const orderId = faker.random.uuid();
      const result = sut.findById(orderId);
      expect(result).rejects.toThrow();
    });
    it('should return undefined if the order dont exist in the database', async () => {
      const sut = sutFactory();
      const orderId = '6019ede587316f001ca8dd57';
      const result = await sut.findById(orderId);
      expect(result).toBeUndefined();
    });
    it('should return the order by his id', async () => {
      const sut = sutFactory();
      const order = await seedOrder({ ...orderWithouIdMock });
      const result = await sut.findById(order.id);
      expect(result).toEqual(removeTimestamps(order));
    });
  });
});
