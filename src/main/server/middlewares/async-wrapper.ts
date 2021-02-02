import { Request, Response, NextFunction } from 'express';

import { HttpRequest, HttpResponse } from '@/presentation/protocols';

export const asyncWrapper = (callback: (request: HttpRequest) => Promise<HttpResponse>) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { statusCode, body } = await callback({
      pathParameters: req.params,
      body: req.body,
    });
    return res.status(statusCode).json(body);
  } catch (error) {
    return next(error);
  }
};
