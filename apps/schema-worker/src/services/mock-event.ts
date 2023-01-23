export const mockCreateObjectS3Record = {
  eventVersion: '2.1',
  eventSource: 'aws:s3',
  awsRegion: 'ap-southeast-2',
  eventTime: '2023-01-22T14:02:02.919Z',
  eventName: 'ObjectCreated:Put',
  userIdentity: {
    principalId: 'AWS:AROAYOHMCCMMPLC7BEUOR:girish.patil@gosource.com.au',
  },
  requestParameters: { sourceIPAddress: '114.129.186.224' },
  responseElements: {
    'x-amz-request-id': '2V42DG43FY92HRW2',
    'x-amz-id-2':
      'rmHYIgaN9/uwU/r5gyOuswwn+xGmGPIPup48xXwy+BE1K6w29lGmnJ4GqJ+t1NZT2RNRZxR5OxoRayCW7Jvn1PuG6AedK+gQ',
  },
  s3: {
    s3SchemaVersion: '1.0',
    configurationId: 'tf-s3-queue-20230120040051451400000001',
    bucket: {
      name: 'dvp-dev-credential-schemas-90ccaf1',
      ownerIdentity: { principalId: 'A2FZ0O30QMUYVQ' },
      arn: 'arn:aws:s3:::dvp-dev-credential-schemas-90ccaf1',
    },
    object: {
      key: 'AANZFTA-COO/partial/schema.json',
      size: 1191,
      eTag: 'be58b3c995eb872dac22d644eeb614cd',
      sequencer: '0063CD41DADEF79E07',
    },
  },
};

export const mockRemoveObjectS3Record = {
  eventVersion: '2.1',
  eventSource: 'aws:s3',
  awsRegion: 'ap-southeast-2',
  eventTime: '2023-01-22T14:02:02.919Z',
  eventName: 'ObjectRemoved:Delete',
  userIdentity: {
    principalId: 'AWS:AROAYOHMCCMMPLC7BEUOR:girish.patil@gosource.com.au',
  },
  requestParameters: { sourceIPAddress: '114.129.186.224' },
  responseElements: {
    'x-amz-request-id': '2V42DG43FY92HRW2',
    'x-amz-id-2':
      'rmHYIgaN9/uwU/r5gyOuswwn+xGmGPIPup48xXwy+BE1K6w29lGmnJ4GqJ+t1NZT2RNRZxR5OxoRayCW7Jvn1PuG6AedK+gQ',
  },
  s3: {
    s3SchemaVersion: '1.0',
    configurationId: 'tf-s3-queue-20230120040051451400000001',
    bucket: {
      name: 'dvp-dev-credential-schemas-90ccaf1',
      ownerIdentity: { principalId: 'A2FZ0O30QMUYVQ' },
      arn: 'arn:aws:s3:::dvp-dev-credential-schemas-90ccaf1',
    },
    object: {
      key: 'AANZFTA-COO/partial/uischema.json',
      size: 1191,
      eTag: 'be58b3c995eb872dac22d644eeb614cd',
      sequencer: '0063CD41DADEF79E07',
    },
  },
};
