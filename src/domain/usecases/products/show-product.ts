import { Product } from "@/domain/models";

export interface ShowProduct {
  show: (name: string) => Promise<Product>;
}
