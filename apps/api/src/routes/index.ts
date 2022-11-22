import { Router } from 'express';
import { storageRoutes } from './storage/index';
import { verifyRoutes } from './verify';
import { issueRoutes } from './issue';

export const router = Router();

router.use('/storage', storageRoutes);
router.use('/verify', verifyRoutes);
router.use('/issue', issueRoutes);
