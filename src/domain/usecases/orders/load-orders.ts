import { Order } from '@/domain/models';

export interface LoadOrders {
  load: () => Promise<Order[]>;
}
