#!/usr/bin/env ts-node-script

import 'reflect-metadata';
import 'tsconfig-paths/register';
import { join } from 'path';
import { createReadStream } from 'fs';
import { container } from 'tsyringe';

import createConnection from '@/config/database';
import { MongoProductsRepository } from '@/infra/db/repositories';
import { getRepository } from 'typeorm';
import { ProductEntity } from './entities';

const readFileAndSeedDatabase = async () => {
  console.log('Starting database seed...');

  const productsRepository = container.resolve(MongoProductsRepository);
  const fileStream = createReadStream(join(__dirname, '..', '..', '..', 'products.csv'));

  fileStream.on('data', async (chunk) => {
    const items = chunk.toString().split('\n');
    items.shift();

    const products = items.map((product) => {
      const [name, price, quantity] = product.split(',');
      return { name, price: Number(price), quantity: Number(quantity) };
    });

    getRepository(ProductEntity).clear();
    await productsRepository.createMany(products);
  });
};

createConnection().then(async () => {
  await readFileAndSeedDatabase();
  setTimeout(() => process.exit(0), 5000);
});
