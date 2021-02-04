import express, { Express } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { setupRoutes } from '@/main/server/routes';
import { errorHandler } from '@/main/server/middlewares';
import * as swaggerDocument from '@/shared/swagger/swagger.json';

const initServer = (): Express => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  setupRoutes(app);

  app.use(errorHandler);
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  return app;
};

export default initServer;
