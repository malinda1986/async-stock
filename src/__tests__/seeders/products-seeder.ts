import { Product } from '@/domain/models';
import { ProductEntity } from '@/infra/db/entities';
import { getRepository } from 'typeorm';

export const seedProduct = async (product: Product): Promise<ProductEntity> => {
  const productsRepository = getRepository(ProductEntity);
  const created = productsRepository.create(product);
  return productsRepository.save(created);
};

export const seedProducts = async (products: Product[]): Promise<ProductEntity[]> => {
  const createdProducts = await Promise.all(
    products.map(async (product) => {
      return seedProduct(product);
    })
  );
  return createdProducts;
};
