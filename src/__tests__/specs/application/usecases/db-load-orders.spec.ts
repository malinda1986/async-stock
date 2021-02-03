import { DbLoadOrders } from '@/application/usecases/orders';
import { OrdersRepositorySpy } from '@/__tests__/doubles/spies';

const sutFactory = () => {
  const ordersRepository = new OrdersRepositorySpy();
  const sut = new DbLoadOrders(ordersRepository);
  return {
    sut,
    ordersRepository,
  };
};

describe('DbLoadOrders', () => {
  describe('when there are orders in the database', () => {
    it('should return all of them', async () => {
      const { sut, ordersRepository } = sutFactory();
      const allSpy = jest.spyOn(ordersRepository, 'all');
      const result = await sut.load();
      expect(allSpy).toHaveBeenCalled();
      expect(result).toEqual(ordersRepository.orders);
    });
  });
  describe('when there are not orders in the database', () => {
    it('should return an empty array', async () => {
      const { sut, ordersRepository } = sutFactory();
      jest.spyOn(ordersRepository, 'all').mockResolvedValueOnce([]);
      const result = await sut.load();
      expect(result).toHaveLength(0);
    });
  });
  describe('when an error occurs in the repository', () => {
    it('should throw the error', () => {
      const { sut, ordersRepository } = sutFactory();
      const error = new Error('Repository error');
      jest.spyOn(ordersRepository, 'all').mockRejectedValueOnce(error);
      const result = sut.load();
      expect(result).rejects.toThrow(error);
    });
  });
});
