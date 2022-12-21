export const schema = {
  type: 'object',
  properties: {
    iD: {
      type: 'string',
    },
    freeTradeAgreement: {
      type: 'string',
      enum: ['AANZFTA'],
    },
    importingJurisdiction: {
      type: 'string',
      enum: [
        'Australia',
        'Brunei Darussalam',
        'Cambodia',
        'Indonesia',
        'Lao PDR',
        'Malaysia',
        'Myanmar',
        'New Zealand',
        'Philippines',
        'Singapore',
        'Thailand',
        'Vietnam',
      ],
    },
    exporterOrManufacturerAbn: {
      type: 'string',
    },
    importerName: {
      type: 'string',
    },
    consignmentReferenceNumber: {
      type: 'string',
    },
    originalDocument: {
      type: 'string',
    },
    documentDeclaration: {
      type: 'boolean',
      title:
        'I certify that the information herein is correct and that the described goods comply with the origin requirements of the specified Free Trade Agreement.',
    },
  },
  required: [
    'iD',
    'freeTradeAgreement',
    'importingJurisdiction',
    'exporterOrManufacturerAbn',
    'consignmentReferenceNumber',
    'originalDocument',
    'documentDeclaration',
  ],
};

export const schemaUI = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/iD',
      label: 'Document Number',
    },
    {
      type: 'Control',
      scope: '#/properties/freeTradeAgreement',
      label: 'Free Trade Agreement',
    },
    {
      type: 'Control',
      scope: '#/properties/importingJurisdiction',
      label: 'Importing Jurisdiction',
    },
    {
      type: 'Control',
      scope: '#/properties/exporterOrManufacturerAbn',
      label: 'Exporter or Manufacturer ABN',
      options: { widget: 'ABN' },
    },
    {
      type: 'Control',
      scope: '#/properties/importerName',
      label: 'Importer Name',
    },
    {
      type: 'Control',
      scope: '#/properties/consignmentReferenceNumber',
      label: 'Consignment Reference Number',
    },
    {
      type: 'Control',
      scope: '#/properties/originalDocument',
      label: 'Original Document',
      options: { widget: 'fileUpload' },
    },

    {
      type: 'Group',
      label: 'Document Declaration',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/documentDeclaration',
        },
      ],
    },
  ],
};
