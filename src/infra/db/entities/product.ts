import { Entity, Column, ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { Product } from '@/domain/models';

@Entity('products')
export class ProductEntity implements Product {
  @ObjectIdColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
