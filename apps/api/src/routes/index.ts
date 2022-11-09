import { Router } from 'express';
import { storageRoutes } from './storage/index';

export const router = Router();

router.use('/storage', storageRoutes);
