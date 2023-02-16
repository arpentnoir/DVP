export const encode = (data: string) => {
  const buff = Buffer.from(data);
  return buff.toString('base64');
};

export const decode = (base64String: string) => {
  const buff = Buffer.from(base64String, 'base64');
  return buff.toString('ascii');
};
