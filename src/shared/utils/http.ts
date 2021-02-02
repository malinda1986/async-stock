import { HttpResponse, HttpStatusCode } from '@/presentation/protocols';

export const ok = (body?: any): HttpResponse => ({
  statusCode: HttpStatusCode.ok,
  body,
});

export const created = (body?: any): HttpResponse => ({
  statusCode: HttpStatusCode.created,
  body,
});
