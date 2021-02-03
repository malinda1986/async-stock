import faker from 'faker';

import { ProductsRepositorySpy } from '@/__tests__/doubles/spies';
import { ApiError } from '@/domain/errors';
import { HttpStatusCode } from '@/presentation/protocols';
import { dbProductMock } from '@/__tests__/doubles/mocks';
import { DbShowProduct } from '@/application/usecases/products';

const sutFactory = () => {
  const productsRepository = new ProductsRepositorySpy();
  const sut = new DbShowProduct(productsRepository);
  return {
    sut,
    productsRepository,
  };
};

describe('DbShowProduct', () => {
  describe('when an invalid product name is sent', () => {
    it('should throw ApiError with not found status', () => {
      const { sut, productsRepository } = sutFactory();
      const productName = faker.random.word();
      const findByNameSpy = jest
        .spyOn(productsRepository, 'findByName')
        .mockResolvedValueOnce(undefined);
      const result = sut.show(productName);
      expect(findByNameSpy).toHaveBeenCalledWith(productName);
      expect(result).rejects.toThrow(
        new ApiError(`Product with name: ${productName} not found`, HttpStatusCode.notFound)
      );
    });
  });
  describe('when a valid product name is sent', () => {
    it('should return the product by the name', async () => {
      const { sut, productsRepository } = sutFactory();
      const product = { ...dbProductMock };
      jest.spyOn(productsRepository, 'findByName').mockResolvedValueOnce(product);
      const result = await sut.show(product.name);
      expect(result).toEqual(product);
    });
  });
  describe('when an error occurs in the repository', () => {
    it('should throw the error', () => {
      const { sut, productsRepository } = sutFactory();
      const error = new Error('Repository error');
      jest.spyOn(productsRepository, 'findByName').mockRejectedValueOnce(error);
      const result = sut.show(faker.random.word());
      expect(result).rejects.toThrow(error);
    });
  });
});
