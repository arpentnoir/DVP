import {
  contextMiddleware,
  errorHandler,
  loggerMiddleware,
  OpenAPIV3Document,
  openApiValidatorMiddleware,
} from '@dvp/server-common';
import cors from 'cors';
import express from 'express';
import nodeProxy from 'node-global-proxy';
import apiSpec from '../openapi/openapi.json';
import { router } from './routes';

if (
  process.env.HTTP_PROXY &&
  process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0' &&
  process.env.NODE_ENV === 'development'
) {
  nodeProxy.setConfig(process.env.HTTP_PROXY);
  nodeProxy.start();
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '6mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/healthcheck', (req, res) => {
  res.send('OK');
});

app.use(openApiValidatorMiddleware(apiSpec as OpenAPIV3Document));
app.use(loggerMiddleware);
app.use(contextMiddleware);
app.use('/api', router); // register api routes
app.use(errorHandler);

export { app };
