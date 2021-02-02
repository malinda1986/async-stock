import { Express } from 'express';

import productsRouter from '@/main/server/routes/products.routes';
import ordersRouter from '@/main/server/routes/orders.routes';

export const setupRoutes = (app: Express): void => {
  app.use('/products', productsRouter);
  app.use('/orders', ordersRouter);
};
