import { Product } from "@/domain/models";

export interface ProductsRepository {
  createMany: (products: Product[]) => Promise<Product[]>;
  findByName: (productName: string) => Promise<Product | undefined>;
}
