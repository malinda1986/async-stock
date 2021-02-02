import { container } from 'tsyringe';

import { MongoOrdersRepository, MongoProductsRepository } from '@/infra/db/repositories';
import { OrdersRepository, ProductsRepository } from '@/application/protocols';

container.registerSingleton<ProductsRepository>('ProductsRepository', MongoProductsRepository);
container.registerSingleton<OrdersRepository>('OrdersRepository', MongoOrdersRepository);
