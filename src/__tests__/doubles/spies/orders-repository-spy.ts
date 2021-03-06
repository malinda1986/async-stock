import { OrdersRepository } from '@/application/protocols';
import { OrderCreation, Order } from '@/domain/models';
import { orderMock } from '@/__tests__/doubles/mocks';

export class OrdersRepositorySpy implements OrdersRepository {
  orders = [{ ...orderMock }, { ...orderMock }];

  order = { ...orderMock };

  async create(_order: OrderCreation & { total: number }): Promise<Order> {
    return orderMock;
  }

  async all(): Promise<Order[]> {
    return this.orders;
  }

  async findById(orderId: string): Promise<Order | undefined> {
    return { ...this.order, id: orderId };
  }
}
