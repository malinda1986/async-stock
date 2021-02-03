import request from 'supertest';
import faker from 'faker';

import '@/main/ioc';
import { prepareConnection } from '@/__tests__/configs/connection';
import initServer from '@/main/server';
import { HttpStatusCode } from '@/presentation/protocols';
import { seedProduct } from '@/__tests__/seeders';
import { productMock } from '@/__tests__/doubles/mocks';

prepareConnection();
const app = initServer();

describe('Products Routes', () => {
  describe('when a request to get a product by name is sent', () => {
    it('should return 404 if the product does not exist in the database', async () => {
      const name = faker.random.word();
      return request(app).get(`/products/${name}`).expect(HttpStatusCode.notFound);
    });
    it('should return 200 with the product if exist', async () => {
      const dbProduct = await seedProduct({ ...productMock });
      return request(app)
        .get(`/products/${dbProduct.name}`)
        .expect(HttpStatusCode.ok)
        .then((response) => {
          const product = response.body;
          expect(product.name).toBe(dbProduct.name);
          expect(product.quantity).toBe(dbProduct.quantity);
          expect(product.price).toBe(dbProduct.price);
        });
    });
  });
});
