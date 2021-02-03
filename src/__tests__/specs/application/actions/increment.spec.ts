import faker from 'faker';

import { IncrementAction } from '@/application/actions';
import { ProductsRepositorySpy } from '@/__tests__/doubles/spies';
import { dbProductMock } from '@/__tests__/doubles/mocks';

const sutFactory = () => {
  const productsRepository = new ProductsRepositorySpy();
  const sut = new IncrementAction(productsRepository);
  return {
    sut,
    productsRepository,
  };
};

describe('IncrementAction', () => {
  describe('when an existing product name is sent', () => {
    it('should increment the quantity of the product', async () => {
      const { sut, productsRepository } = sutFactory();
      const product = { ...dbProductMock };
      const findByNameSpy = jest
        .spyOn(productsRepository, 'findByName')
        .mockResolvedValueOnce(product);
      const updateSpy = jest.spyOn(productsRepository, 'update');
      const productName = faker.random.word();

      await sut.handle({
        data: productName,
      });

      expect(findByNameSpy).toHaveBeenCalledWith(productName);
      expect(updateSpy).toHaveBeenCalledWith({
        ...product,
        quantity: product.quantity + 1,
      });
    });
  });
  describe('when an invalid product name is sent', () => {
    it('should return undefined', async () => {
      const { sut, productsRepository } = sutFactory();
      jest.spyOn(productsRepository, 'findByName').mockResolvedValueOnce(undefined);
      const updateSpy = jest.spyOn(productsRepository, 'update');

      const result = await sut.handle({
        data: faker.random.word(),
      });

      expect(updateSpy).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
});
