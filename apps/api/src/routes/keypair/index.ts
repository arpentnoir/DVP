/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import {
  createKeyPair,
  deleteKeyPair,
  disableKeyPair,
  getKeyPair,
  listKeyPairs,
} from './keypair.controller';

export const keyPairRoutes = Router();

// Map API routes to controller functions
keyPairRoutes
  .post('/', createKeyPair)
  .get('/', listKeyPairs)
  .get('/:keyId', getKeyPair)
  .delete('/:keyId', deleteKeyPair)
  .put('/:keyId/disable', disableKeyPair);
