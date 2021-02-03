import { container } from 'tsyringe';

import { Product } from '@/domain/models';
import { ShowProduct } from '@/domain/usecases/products';
import { HttpRequest, HttpResponse } from '@/presentation/protocols';
import { ok } from '@/shared/utils/http';

export class ProductsController {
  async show(httpRequest: HttpRequest): Promise<HttpResponse<Product>> {
    const { name } = httpRequest.pathParameters as { name: string };

    const showProduct = container.resolve<ShowProduct>('ShowProduct');
    const dbProduct = await showProduct.show(name);

    const { id: _, ...product } = dbProduct;
    return ok(product);
  }
}
