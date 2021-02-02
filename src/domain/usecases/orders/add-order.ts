import { Order, OrderCreation } from '@/domain/models';

export interface AddOrder {
  add: (order: OrderCreation) => Promise<Order>;
}
