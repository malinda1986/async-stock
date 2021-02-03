import { OrdersRepository } from '@/application/protocols';
import { OrderCreation, Order } from '@/domain/models';
import { orderMock } from '@/__tests__/doubles/mocks';

export class OrdersRepositorySpy implements OrdersRepository {
  async create(_order: OrderCreation & { total: number }): Promise<Order> {
    return orderMock;
  }

  async all(): Promise<Order[]> {
    return [orderMock, orderMock];
  }

  async findById(_orderId: string): Promise<Order | undefined> {
    return orderMock;
  }
}
