import { Router } from 'express';
import { validate } from './validate.controller';

export const validateRoutes = Router();

validateRoutes.post('/', validate);
