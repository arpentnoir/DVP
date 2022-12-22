import { Router } from 'express';
import { issueRoutes } from './issue';
import { storageRoutes } from './storage/index';
import { verifyRoutes } from './verify';

export const router = Router();

router.use('/storage', storageRoutes);
router.use('/verify', verifyRoutes);
router.use('/issue', issueRoutes);
