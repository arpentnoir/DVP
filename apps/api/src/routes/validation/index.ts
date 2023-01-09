import { Router } from 'express';
import { validate } from './validation.controller';

export const validateRoutes = Router();

validateRoutes.post('/', validate);
