import cors from 'cors';
import express from 'express';
import apiSpec from '../openapi/openapi.json';
import { contextMiddleware, errorHandler, loggerMiddleware, OpenAPIV3Document, openApiValidatorMiddleware } from './middlewares';
import { router } from './routes';

const app = express();
app.use(cors());
app.use(express.json());
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
