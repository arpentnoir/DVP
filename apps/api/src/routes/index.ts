import { Router } from 'express';
import { issueRoutes } from './issue';
import { storageRoutes } from './storage/index';
import { verifyRoutes } from './verify';
import { validateRoutes } from './validation';

export const router = Router();

router.use('/storage', storageRoutes);
router.use('/verify', verifyRoutes);
router.use('/issue', issueRoutes);
router.use('/validate', validateRoutes);
