import faker from 'faker';

import { DbAddOrder } from '@/application/usecases/orders';
import { ApiError } from '@/domain/errors';
import { HttpStatusCode } from '@/presentation/protocols';
import {
  OrdersRepositorySpy,
  ProductsRepositorySpy,
  ShowProductSpy,
} from '@/__tests__/doubles/spies';
import { DbProduct } from '@/domain/models';
import { DbProductsBuilder, OrderCreationBuilder } from '@/__tests__/builders';

const sutFactory = () => {
  const showProduct = new ShowProductSpy();
  const productsRepository = new ProductsRepositorySpy();
  const ordersRepository = new OrdersRepositorySpy();
  const sut = new DbAddOrder(showProduct, productsRepository, ordersRepository);
  return {
    sut,
    showProduct,
    productsRepository,
    ordersRepository,
  };
};

const stubProducts = (showProduct: ShowProductSpy, products: DbProduct[]) => {
  jest
    .spyOn(showProduct, 'show')
    .mockResolvedValueOnce(products[0])
    .mockResolvedValueOnce(products[1]);
};

describe('DbAddOrder', () => {
  describe('when a invalid product is sent', () => {
    it('should throw ApiError if some of the products was not found', () => {
      const { sut, showProduct } = sutFactory();
      const error = new ApiError('Product not found', HttpStatusCode.notFound);
      jest.spyOn(showProduct, 'show').mockRejectedValue(error);
      const order = OrderCreationBuilder.aOrderCreation().build();

      const result = sut.add(order);

      expect(result).rejects.toThrow(error);
    });
    it('should throw ApiError if the quantity of the product in the stock is equal 0', () => {
      const { sut, showProduct } = sutFactory();
      const order = OrderCreationBuilder.aOrderCreation().build();
      const foundProduct = DbProductsBuilder.aListOfProducts(order.products as DbProduct[])
        .withQuantity(0)
        .build()[0];
      jest.spyOn(showProduct, 'show').mockResolvedValueOnce(foundProduct);

      const result = sut.add(order);

      expect(result).rejects.toThrow(
        new ApiError(
          `Product ${foundProduct.name} is out of stock`,
          HttpStatusCode.unprocessableEntity
        )
      );
    });
    it('should throw ApiError if the sent quantity is grater than the stock', () => {
      const { sut, showProduct } = sutFactory();
      const order = OrderCreationBuilder.aOrderCreation().withQuantity(10).build();
      const foundProduct = DbProductsBuilder.aListOfProducts(order.products as DbProduct[])
        .withQuantity(2)
        .build()[0];
      jest.spyOn(showProduct, 'show').mockResolvedValueOnce(foundProduct);

      const result = sut.add(order);

      expect(result).rejects.toThrow(
        new ApiError(
          `Product ${foundProduct.name} is out of stock`,
          HttpStatusCode.unprocessableEntity
        )
      );
    });
  });
  describe('when the sent products are valid', () => {
    it('should update the quantity of the products with the quantity sent', async () => {
      const { sut, showProduct, productsRepository } = sutFactory();
      const updateSpy = jest.spyOn(productsRepository, 'update');
      const order = OrderCreationBuilder.aOrderCreation().withQuantity(3).build();
      const foundProducts = DbProductsBuilder.aListOfProducts(order.products as DbProduct[])
        .withQuantity(5)
        .build();
      stubProducts(showProduct, foundProducts);
      await sut.add(order);

      foundProducts.forEach((product, index) => {
        expect(updateSpy).nthCalledWith(index + 1, {
          ...product,
          quantity: product.quantity - order.products[index].quantity,
        });
      });
    });
    it('should create and return the order', async () => {
      const { sut, showProduct, ordersRepository } = sutFactory();
      const order = OrderCreationBuilder.aOrderCreation().withQuantity(3).build();
      const foundProducts = DbProductsBuilder.aListOfProducts(order.products as DbProduct[])
        .withQuantity(5)
        .withPrice(10)
        .build();
      const createParams = {
        products: foundProducts.map((product, index) => {
          const { id, ...dbProduct } = product;
          return {
            ...dbProduct,
            quantity: order.products[index].quantity,
          };
        }),
        total: 60,
      };
      const createResult = { ...createParams, id: faker.random.uuid() };
      const createSpy = jest.spyOn(ordersRepository, 'create').mockResolvedValueOnce(createResult);
      stubProducts(showProduct, foundProducts);

      const result = await sut.add(order);

      expect(createSpy).toHaveBeenCalledWith(createParams);
      expect(result).toEqual(createResult);
    });
  });
});
