import faker from 'faker';

import { DbShowOrder } from '@/application/usecases/orders';
import { OrdersRepositorySpy } from '@/__tests__/doubles/spies';
import { ApiError } from '@/domain/errors';
import { HttpStatusCode } from '@/presentation/protocols';
import { orderMock } from '@/__tests__/doubles/mocks';

const sutFactory = () => {
  const ordersRepository = new OrdersRepositorySpy();
  const sut = new DbShowOrder(ordersRepository);
  return {
    sut,
    ordersRepository,
  };
};

describe('DbShowOrder', () => {
  describe('when an invalid order id is sent', () => {
    it('should throw ApiError with not found status', () => {
      const { sut, ordersRepository } = sutFactory();
      const orderId = faker.random.uuid();
      const findByIdSpy = jest.spyOn(ordersRepository, 'findById').mockResolvedValueOnce(undefined);
      const result = sut.show(orderId);
      expect(findByIdSpy).toHaveBeenCalledWith(orderId);
      expect(result).rejects.toThrow(
        new ApiError(`Order with id: ${orderId} not found`, HttpStatusCode.notFound)
      );
    });
  });
  describe('when a valid order id is sent', () => {
    it('should return the order by the id', async () => {
      const { sut, ordersRepository } = sutFactory();
      const order = { ...orderMock, id: faker.random.uuid() };
      jest.spyOn(ordersRepository, 'findById').mockResolvedValueOnce(order);
      const result = await sut.show(order.id);
      expect(result).toEqual(order);
    });
  });
  describe('when an error occurs in the repository', () => {
    it('should throw the error', () => {
      const { sut, ordersRepository } = sutFactory();
      const error = new Error('Repository error');
      jest.spyOn(ordersRepository, 'findById').mockRejectedValueOnce(error);
      const result = sut.show(faker.random.uuid());
      expect(result).rejects.toThrow(error);
    });
  });
});
