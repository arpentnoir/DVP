import {
  CreateKeyPairRequest,
  CreateKeyPairResponse,
  GetKeyPairResponse,
  ListKeyPairResponse,
} from '@dvp/api-client';
import type { NextFunction, Request, Response } from 'express';
import { KeyPairService } from './keypair.service';

export const createKeyPair = async (
  req: Request,
  res: Response<CreateKeyPairResponse>,
  next: NextFunction
) => {
  try {
    const payload = req.body as CreateKeyPairRequest;
    const keyPairService = new KeyPairService(req.invocationContext);
    const response = await keyPairService.createKeyPair(payload);
    return res.status(201).json(response);
  } catch (err) {
    return next(err);
  }
};

export const getKeyPair = async (
  req: Request<{ keyId: string }>,
  res: Response<GetKeyPairResponse>,
  next: NextFunction
) => {
  const { keyId } = req.params;

  try {
    const keyPairService = new KeyPairService(req.invocationContext);
    const response = await keyPairService.getKeyPair(keyId);
    return res.status(200).json(response);
  } catch (err) {
    return next(err);
  }
};

export const listKeyPairs = async (
  req: Request<null, ListKeyPairResponse, null, { includeDisabled?: boolean }>,
  res: Response<ListKeyPairResponse>,
  next: NextFunction
) => {
  const { includeDisabled } = req.query;

  try {
    const keyPairService = new KeyPairService(req.invocationContext);
    const response = await keyPairService.listKeyPairs(includeDisabled);
    return res.status(200).json(response);
  } catch (err) {
    return next(err);
  }
};

export const deleteKeyPair = async (
  req: Request<{ keyId: string }>,
  res: Response<void>,
  next: NextFunction
) => {
  const { keyId } = req.params;

  try {
    const keyPairService = new KeyPairService(req.invocationContext);
    await keyPairService.deleteKeyPair(keyId);
    return res.status(200).end();
  } catch (err) {
    return next(err);
  }
};

export const disableKeyPair = async (
  req: Request<{ keyId: string }>,
  res: Response<void>,
  next: NextFunction
) => {
  const { keyId } = req.params;

  try {
    const keyPairService = new KeyPairService(req.invocationContext);
    await keyPairService.disableKeyPair(keyId);
    return res.status(200).end();
  } catch (err) {
    return next(err);
  }
};
