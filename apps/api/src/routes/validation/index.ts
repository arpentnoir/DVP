import { Router } from 'express';
import { authMiddleware } from '../../middlewares';
import { validate } from './validation.controller';

export const validateRoutes = Router();

validateRoutes.post('/', authMiddleware, validate);
