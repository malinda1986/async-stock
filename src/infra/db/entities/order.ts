import { Entity, Column, ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { Order, Product } from '@/domain/models';

@Entity('orders')
export class OrderEntity implements Order {
  @ObjectIdColumn()
  id: string;

  @Column()
  products: Product[];

  @Column()
  total: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
