import { Router } from 'express';
import { handleVerify } from './verify.controller';

export const verifyRoutes = Router();

verifyRoutes.post('/', handleVerify);
