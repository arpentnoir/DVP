import { Router } from 'express';
import { storageRoutes } from './storage/index';
import { verifyRoutes } from './verify';

export const router = Router();

router.use('/storage', storageRoutes);
router.use('/verify', verifyRoutes);

