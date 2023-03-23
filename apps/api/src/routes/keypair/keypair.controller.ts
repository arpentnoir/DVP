import {
  CreateKeyPairRequest,
  CreateKeyPairResponse,
  GetKeyPairResponse,
  ListKeyPairResponse,
} from '@dvp/api-client';
import type { NextFunction, Request, Response } from 'express';
import { KeyPairService } from './keypair.service';

/**
 * Creates a public/private encryption key pair by invoking the @see {KeyPairService}.
 * 
 * @param req The request from which to extract the create key pair payload.
 * @param res The Express response to be returned.
 * @param next The next function injected by the Express router which, when invoked, executes the next middleware.
 * @returns A HTTP 201 containing the result of the @see {KeyPairService.createKeyPair} function call.
 */
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

/**
 * Gets the public portions of a given key pair by invoking the @see {KeyPairService}.
 * Note - Does not return the private key.
 * 
 * @param req The request from which to extract the keyId
 * @param res The Express response to be returned.
 * @param next The next function injected by the Express router which, when invoked, executes the next middleware.
 * @returns A HTTP 200 containing the result of the @see {KeyPairService.getKeyPair} function call.
 */
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

/**
 * Returns a list of public/private encryption key pairs by invoking the @see {KeyPairService}.
 * 
 * @param req The request from which to extract the list key pairs query - this will contain a flag indicating if disabled keypairs are to be returned.
 * @param res The Express response to be returned.
 * @param next The next function injected by the Express router which, when invoked, executes the next middleware.
 * @returns A HTTP 200 containing the key pairs as returned by @see {KeyPairService.listKeyPairs}.
 */
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

/**
 * Deletes a public/private encryption key pair by invoking the @see {KeyPairService}.
 * 
 * @param req The request from which to extract the keyId to be deleted.
 * @param res The Express response to be returned.
 * @param next The next function injected by the Express router which, when invoked, executes the next middleware.
 * @returns A HTTP 200.
 */
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

/**
 * Disables a public/private encryption key pair by invoking the @see {KeyPairService}.
 * 
 * @param req The request from which to extract the keyId to be disabled.
 * @param res The Express response to be returned.
 * @param next The next function injected by the Express router which, when invoked, executes the next middleware.
 * @returns A HTTP 200.
 */
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
