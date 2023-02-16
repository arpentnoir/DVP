import { Router } from 'express';
import { credentialsRoutes } from './credentials';
import { storageRoutes } from './storage';

export const router = Router();

router.use('/storage', storageRoutes);
router.use('/credentials', credentialsRoutes);
