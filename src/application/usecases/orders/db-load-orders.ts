import { inject, injectable } from 'tsyringe';

import { OrdersRepository } from '@/application/protocols';
import { Order } from '@/domain/models';
import { LoadOrders } from '@/domain/usecases/orders';

@injectable()
export class DbLoadOrders implements LoadOrders {
  constructor(
    @inject('OrdersRepository')
    private readonly ordersRepository: OrdersRepository
  ) {}

  async load(): Promise<Order[]> {
    return this.ordersRepository.all();
  }
}
