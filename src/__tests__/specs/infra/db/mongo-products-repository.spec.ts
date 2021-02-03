import faker from 'faker';

import { ProductEntity } from '@/infra/db/entities';
import { MongoProductsRepository } from '@/infra/db/repositories';
import { prepareConnection } from '@/__tests__/configs/connection';
import { seedProduct } from '@/__tests__/seeders';
import { productMock } from '@/__tests__/doubles/mocks';
import { getRepository } from 'typeorm';

prepareConnection();

const sutFactory = (): MongoProductsRepository => new MongoProductsRepository();

const removeTimestamps = (
  product: ProductEntity
): Omit<ProductEntity, 'created_at' | 'updated_at'> => {
  const { createdAt: _, updatedAt: __, ...without } = product;
  return without;
};

describe('MongoProductsRepository', () => {
  describe('findByName', () => {
    it('should return undefined if the product dont exist in the database', async () => {
      const sut = sutFactory();
      const productName = faker.random.word();
      const result = await sut.findByName(productName);
      expect(result).toBeUndefined();
    });
    it('should return the product by his name', async () => {
      const sut = sutFactory();
      const product = await seedProduct({ ...productMock });
      const result = await sut.findByName(product.name);
      expect(result).toEqual(removeTimestamps(product));
    });
  });
  describe('update', () => {
    it('should update a given product with his new values', async () => {
      const sut = sutFactory();
      const product = await seedProduct({ ...productMock });
      const updatedProduct = {
        ...product,
        quantity: faker.random.number(),
        price: faker.random.number(),
      };
      const result = await sut.update(updatedProduct);
      expect(result.name).toBe(updatedProduct.name);
      expect(result.price).toBe(updatedProduct.price);
      expect(result.quantity).toBe(updatedProduct.quantity);
    });
  });
  describe('createMany', () => {
    it('should insert all the products in the database and return it', async () => {
      const sut = sutFactory();
      const products = [{ ...productMock }, { ...productMock }];
      const result = await sut.createMany(products);
      const dbProducts = await getRepository(ProductEntity).find();
      expect(dbProducts).toHaveLength(2);
      expect(result).toEqual(dbProducts);
    });
  });
});
