import { Request, Response, NextFunction } from 'express';

import { ApiError } from '@/domain/errors';
import { HttpStatusCode } from '@/presentation/protocols';

export const errorHandler = (err: Error, _: Request, res: Response, __: NextFunction) => {
  const error = err as ApiError;
  return res
    .status(error.statusCode || HttpStatusCode.serverError)
    .json({ message: error.message || 'Internal server error' });
};
