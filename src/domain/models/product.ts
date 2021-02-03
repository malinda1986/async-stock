export interface Product {
  name: string;
  price: number;
  quantity: number;
}

export type DbProduct = Product & { id: string };
