import { Router } from 'express';
import { validate } from './validate.controller';

export const validateRoutes = Router();

// Map API routes to controller functions
validateRoutes.post('/', validate);
