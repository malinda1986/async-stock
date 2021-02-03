import { inject, injectable } from 'tsyringe';

import { ActionParams, AsyncAction, ProductsRepository } from '@/application/protocols';

@injectable()
export class DecrementAction implements AsyncAction {
  constructor(
    @inject('ProductsRepository')
    private readonly productsRepository: ProductsRepository
  ) {}

  async handle(params: ActionParams): Promise<void> {
    const { data } = params;
    const name = data.replace(`"`, '').replace(`"`, '');

    const product = await this.productsRepository.findByName(name);
    if (product && product.quantity) {
      await this.productsRepository.update({
        ...product,
        quantity: product.quantity - 1,
      });
    }
  }
}
