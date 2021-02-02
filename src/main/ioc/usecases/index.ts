import { container } from 'tsyringe';

import { ShowProduct } from '@/domain/usecases/products';
import { DbShowProduct } from '@/application/usecases/products';
import { DbAddOrder, DbLoadOrders, DbShowOrder } from '@/application/usecases/orders';
import { AddOrder, LoadOrders, ShowOrder } from '@/domain/usecases/orders';

container.registerSingleton<ShowProduct>('ShowProduct', DbShowProduct);
container.registerSingleton<AddOrder>('AddOrder', DbAddOrder);
container.registerSingleton<LoadOrders>('LoadOrders', DbLoadOrders);
container.registerSingleton<ShowOrder>('ShowOrder', DbShowOrder);
