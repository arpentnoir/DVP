import { v4 as uuidV4, validate } from 'uuid';

export const getUuId = () => uuidV4();

export const getUuIdFromUrn = (urn: string) => {
  const uuid = urn.replace('urn:uuid:', '');

  return validate(uuid) ? uuid : undefined;
};
