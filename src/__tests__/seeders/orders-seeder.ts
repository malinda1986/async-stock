import { Order } from '@/domain/models';
import { OrderEntity } from '@/infra/db/entities';
import { getRepository } from 'typeorm';

export const seedOrder = async (order: Omit<OrderEntity, 'id'>): Promise<OrderEntity> => {
  const ordersRepository = getRepository(OrderEntity);
  const created = ordersRepository.create(order);
  return ordersRepository.save(created);
};

export const seedOrders = async (orders: Omit<Order, 'id'>[]): Promise<Order[]> => {
  const createdOrders = await Promise.all(
    orders.map(async (order) => {
      return seedOrder(order);
    })
  );
  return createdOrders;
};
