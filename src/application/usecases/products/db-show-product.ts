import { inject, injectable } from 'tsyringe';

import { DbProduct } from '@/domain/models';
import { ShowProduct } from '@/domain/usecases/products';
import { ProductsRepository } from '@/application/protocols';
import { HttpStatusCode } from '@/presentation/protocols';
import { ApiError } from '@/domain/errors';

@injectable()
export class DbShowProduct implements ShowProduct {
  constructor(
    @inject('ProductsRepository')
    private readonly productsRepository: ProductsRepository
  ) {}

  async show(name: string): Promise<DbProduct> {
    const product = await this.productsRepository.findByName(name);

    if (!product) {
      throw new ApiError(`Product with name: ${name} not found`, HttpStatusCode.notFound);
    }

    return product;
  }
}
