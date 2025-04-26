// import { seedDb } from './seed-db';

import { IS_BROWSER, IS_SERVER } from '@/config/constants';

const initializeMocks = async () => {
  console.log('process.env.NEXT_RUNTIME', process.env.NEXT_RUNTIME);
  console.log('IS_BROWSER', IS_BROWSER);
  console.log('IS_SERVER', IS_SERVER);
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { server } = await import('./server');
    server.listen();
  } else {
    const { worker } = await import('./browser');
    await worker.start();
  }
  // seedDb();
};

initializeMocks();
