import request from 'supertest';
import faker from 'faker';

import '@/main/ioc';
import { prepareConnection } from '@/__tests__/configs/connection';
import initServer from '@/main/server';
import { HttpStatusCode } from '@/presentation/protocols';
import { seedOrder, seedOrders, seedProduct } from '@/__tests__/seeders';
import { orderWithouIdMock, productMock } from '@/__tests__/doubles/mocks';

prepareConnection();
const app = initServer();

describe('Orders Routes', () => {
  describe('when a order is sent to be created', () => {
    it('should return 400 if there are no products in the request', () => {
      return request(app)
        .post('/orders')
        .set({ 'Content-Type': 'application/json' })
        .send({})
        .expect(HttpStatusCode.badRequest);
    });
    it('should return 400 if the name of the product is missing', () => {
      return request(app)
        .post('/orders')
        .set({ 'Content-Type': 'application/json' })
        .send({
          products: [
            {
              quantity: faker.random.number(),
            },
          ],
        })
        .expect(HttpStatusCode.badRequest);
    });
    it('should return 400 if the quantity of the product is missing', () => {
      return request(app)
        .post('/orders')
        .set({ 'Content-Type': 'application/json' })
        .send({
          products: [
            {
              name: faker.random.word(),
            },
          ],
        })
        .expect(HttpStatusCode.badRequest);
    });
    it('should return 404 if the sent product does not exist in the database', () => {
      return request(app)
        .post('/orders')
        .set({ 'Content-Type': 'application/json' })
        .send({
          products: [
            {
              name: faker.random.word(),
              quantity: faker.random.number(),
            },
          ],
        })
        .expect(HttpStatusCode.notFound);
    });
    it('should return 422 if the quantity sent is greater than the stock of the product', async () => {
      const product = await seedProduct({ ...productMock, quantity: 2 });

      return request(app)
        .post('/orders')
        .set({ 'Content-Type': 'application/json' })
        .send({
          products: [
            {
              name: product.name,
              quantity: 3,
            },
          ],
        })
        .expect(HttpStatusCode.unprocessableEntity);
    });
    it('should return 201 when the order is created successfully', async () => {
      const product = await seedProduct({ ...productMock, quantity: 10 });

      return request(app)
        .post('/orders')
        .set({ 'Content-Type': 'application/json' })
        .send({
          products: [
            {
              name: product.name,
              quantity: 9,
            },
          ],
        })
        .expect(HttpStatusCode.created);
    });
  });
  describe('when try to GET all the orders', () => {
    it('should return an empty orders array if there are no orders in the database', async () => {
      return request(app)
        .get('/orders')
        .expect(HttpStatusCode.ok)
        .then((response) => {
          expect(response.body.orders).toHaveLength(0);
        });
    });
    it('should return all of the orders from the database', async () => {
      await seedOrders([{ ...orderWithouIdMock }, { ...orderWithouIdMock }]);

      return request(app)
        .get('/orders')
        .expect(HttpStatusCode.ok)
        .then((response) => {
          const { orders } = response.body;
          expect(orders).toHaveLength(2);
        });
    });
  });
  describe('when a request to get an order by id is sent', () => {
    it('should return 404 if the order does not exist in the database', async () => {
      return request(app).get('/orders/6019ede587316f001ca8dd57').expect(HttpStatusCode.notFound);
    });
    it('should return 200 with the order if exist', async () => {
      const dbOrder = await seedOrder({ ...orderWithouIdMock });
      return request(app)
        .get(`/orders/${dbOrder.id}`)
        .expect(HttpStatusCode.ok)
        .then((response) => {
          const order = response.body;
          expect(order.products).toEqual(dbOrder.products);
          expect(order.total).toBe(dbOrder.total);
        });
    });
  });
});
