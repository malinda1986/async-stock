import 'reflect-metadata';
import 'tsconfig-paths/register';

import '@/main/ioc';
import initWoker from '@/main/worker';
import initServer from '@/main/server';
import createConnection from '@/config/database';

initWoker();

const PORT = 5000;
createConnection().then(() => initServer().listen(PORT, () => console.log(`Listening at ${PORT}`)));
