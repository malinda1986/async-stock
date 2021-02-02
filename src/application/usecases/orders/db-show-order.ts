import { inject, injectable } from 'tsyringe';

import { Order } from '@/domain/models';
import { ShowOrder } from '@/domain/usecases/orders';
import { OrdersRepository } from '@/application/protocols';
import { ApiError } from '@/domain/errors';
import { HttpStatusCode } from '@/presentation/protocols';

@injectable()
export class DbShowOrder implements ShowOrder {
  constructor(
    @inject('OrdersRepository')
    private readonly ordersRepository: OrdersRepository
  ) {}

  async show(id: string): Promise<Order> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new ApiError(`Order with id: ${id} not found`, HttpStatusCode.notFound);
    }

    return order as Order;
  }
}
