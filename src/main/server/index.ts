import express, { Express } from 'express';
import cors from 'cors';

import { setupRoutes } from '@/main/server/routes';
import { errorHandler } from '@/main/server/middlewares';

const initServer = (): Express => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  setupRoutes(app);

  app.use(errorHandler);

  return app;
};

export default initServer;
