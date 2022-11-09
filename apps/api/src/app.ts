import express from 'express';
import cors from 'cors';
import { router } from './routes';
import { logger, errorHandler } from './middlewares';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/healthcheck', (req, res) => {
  res.send('OK');
});

app.use(logger);
app.use('/api', router);
app.use(errorHandler);

export { app };
