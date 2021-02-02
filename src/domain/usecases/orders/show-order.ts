import { Order } from '@/domain/models';

export interface ShowOrder {
  show: (id: string) => Promise<Order>;
}
