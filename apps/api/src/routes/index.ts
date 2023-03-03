import { Router } from 'express';
import { credentialsRoutes } from './credentials';
import { storageRoutes } from './storage';

import { authMiddleware } from '@dvp/server-common';
import { keyPairRoutes } from './keypair';
export const router = Router();

router.use('/storage', storageRoutes);
router.use('/credentials', credentialsRoutes);
router.use('/keypairs', authMiddleware, keyPairRoutes);
