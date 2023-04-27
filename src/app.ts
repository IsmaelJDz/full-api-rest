import dotenv from 'dotenv';
dotenv.config();

//import express from 'express';
import config from 'config';

import connect from './utils/connect';
import logger from './utils/logger';
//import routes from './routes';
//import deserializeUser from './middleware/deserializeUser';
import createServer from './utils/server';

const port = config.get<number>('port');

// export const app = express();
// app.use(express.json());
// app.use(deserializeUser);
const app = createServer();

app.listen(port, async () => {
  logger.info(`Server is running on http://localhost:${port} port`);

  await connect();
  // routes(app);
});
