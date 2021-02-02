import { Product } from '@/domain/models';

export interface OrderCreation {
  products: Omit<Product, 'price'>[];
}

export interface Order {
  id: string;
  products: Product[];
  total: number;
}
