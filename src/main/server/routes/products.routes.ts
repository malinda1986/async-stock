import { Router } from 'express';
import { container } from 'tsyringe';
import { Joi, Segments, errors, celebrate } from 'celebrate';

import { ProductsController } from '@/presentation/controllers/products';
import { asyncWrapper } from '@/main/server/middlewares';

const productsRouter = Router();
const productsController = container.resolve(ProductsController);

productsRouter.get(
  '/:name',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      name: Joi.string().required(),
    }),
  }),
  asyncWrapper(productsController.show)
);

productsRouter.use(errors());

export default productsRouter;
