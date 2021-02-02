import { Router } from 'express';
import { container } from 'tsyringe';
import { Joi, Segments, errors, celebrate } from 'celebrate';

import { OrdersController } from '@/presentation/controllers/orders';
import { asyncWrapper } from '@/main/server/middlewares';

const ordersRouter = Router();
const ordersController = container.resolve(OrdersController);

ordersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      products: Joi.array()
        .items(
          Joi.object().keys({
            name: Joi.string().required(),
            quantity: Joi.number().min(1).required(),
          })
        )
        .required(),
    }),
  }),
  asyncWrapper(ordersController.store)
);

ordersRouter.get('/', asyncWrapper(ordersController.index));

ordersRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),
  asyncWrapper(ordersController.show)
);

ordersRouter.use(errors());

export default ordersRouter;
