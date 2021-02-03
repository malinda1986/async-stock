import { DbProduct } from '@/domain/models';

export interface ShowProduct {
  show: (name: string) => Promise<DbProduct>;
}
