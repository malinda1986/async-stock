import {
  Entity,
  Column,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { ObjectID } from 'mongodb';

import { Product } from '@/domain/models';

@Entity('products')
export class ProductEntity implements Product {
  @ObjectIdColumn()
  id: string | ObjectID;

  @PrimaryColumn()
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
