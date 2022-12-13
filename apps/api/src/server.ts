import { logger } from '@dvp/server-common';

import { app } from './app';

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  logger.info(`Listening at http://localhost:${port}`);
});
server.on('error', logger.error);
