export enum HttpStatusCode {
  ok = 200,
  created = 201,
  noContent = 204,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  unprocessableEntity = 422,
  serverError = 500,
}

export type HttpRequest<T = any> = {
  headers?: Record<string, string>;
  pathParameters?: Record<string, string>;
  body?: T;
};

export type HttpResponse<T = any> = {
  statusCode: HttpStatusCode;
  body?: T;
};
