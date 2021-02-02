import { Order, OrderCreation } from '@/domain/models';

export interface OrdersRepository {
  create: (order: OrderCreation & { total: number }) => Promise<Order>;
  all: () => Promise<Order[]>;
  findById: (orderId: string) => Promise<Order | undefined>;
}
