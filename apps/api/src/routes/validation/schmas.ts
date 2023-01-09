const PostalAddress = {
  type: 'object',
  required: [
    'line1',
    'cityName',
    'postcode',
    'countryCode',
  ],
  properties: {
    line1: {
      type: 'string',
       minLength: 1,
    },
    line2: {
      type: 'string',
       minLength: 1,
    },
    cityName: {
      type: 'string',
       minLength: 1,
    },
    postcode: {
      type: 'string',
       minLength: 1,
    },
    countrySubDivisionName: {
      type: 'string',
       minLength: 1,
    },
    countryCode: {
      type: 'string',
       minLength: 1,
    },
  },
};

const TransportPackage = {
  type: 'object',
  required: ['iD', 'grossVolume', 'grossWeight'],
  properties: {
    iD: {
      type: 'string',
       minLength: 1,
    },
    grossVolume: {
      type: 'string',
       minLength: 1,
    },
    grossWeight: {
      type: 'string',
       minLength: 1,
    },
  },
};

const TradeLineItem = {
  type: 'object',
  required: [
    'sequenceNumber',
    'invoiceReference',
    'tradeProduct',
    'transportPackages',
  ],
  properties: {
    sequenceNumber: {
      type: 'number',
    },
    invoiceReference: {
      type: 'object',
      required: ['iD', 'issueDateTime'],
      properties: {
        iD: {
          type: 'string',
           minLength: 1,
        },
        // TODO: Confirm if formattedIssueDateTime is part of document
        // formattedIssueDateTime: {
        //   type: 'string',
        // },
        issueDateTime: {
          type: 'string',
           minLength: 1,
           format: 'date-time',
        },
        attachedBinaryFile: {
          type: 'object',
          required: ['uRI'],
          properties: {
            uRI: {
              type: 'string',
               minLength: 1,
            },
          },
        },
      },
    },
    tradeProduct: {
      type: 'object',
      required: ['iD', 'description', 'harmonisedTariffCode', 'originCountry'],
      properties: {
        iD: {
          type: 'string',
           minLength: 1,
        },
        description: {
          type: 'string',
           minLength: 1,
        },
        harmonisedTariffCode: {
          type: 'object',
          required: ['classCode', 'className'],
          properties: {
            classCode: {
              type: 'string',
               minLength: 1,
            },
            className: {
              type: 'string',
               minLength: 1,
            },
          },
        },
        originCountry: {
          type: 'object',
          required: ['code'],
          properties: {
            code: {
              type: 'string',
               minLength: 1,
            },
          },
        },
      },
    },
    transportPackages: {
      type: 'array',
      items: TransportPackage,
      minItems: 1,
    },
  },
};

const ConsignmentItem = {
  type: 'object',
  required: [
    'iD',
    'information',
    'crossBorderRegulatoryProcedure',
    'manufacturer',
    'tradeLineItems',
  ],
  properties: {
    iD: {
      type: 'string',
       minLength: 1,
    },
    information: {
      type: 'string',
       minLength: 1,
    },
    crossBorderRegulatoryProcedure: {
      type: 'object',
      required: ['originCriteriaText'],
      properties: {
        originCriteriaText: {
          type: 'string',
           minLength: 1,
        },
      },
    },
    manufacturer: {
      type: 'object',
      required: ['iD', 'name'],
      properties: {
        iD: {
          type: 'string',
           minLength: 1,
        },
        name: {
          type: 'string',
           minLength: 1,
        },
        postalAddress: PostalAddress,
      },
    },
    tradeLineItems: {
      type: 'array',
      items: TradeLineItem,
      minItems: 1,
    },
  },
};

export const AANZ_FTA_COO_SCHEMA = {
  type: 'object',
  required: ['credentialSubject'],
  properties: {
    credentialSubject: {
      type: 'object',
      required: [
        'iD',
        'issueDateTime',
        // 'name',
        'firstSignatoryAuthentication',
        'secondSignatoryAuthentication',
        'isPreferential',
        'supplyChainConsignment',
      ],
      properties: {
        iD: {
          type: 'string',
           minLength: 1,
        },
        issueDateTime: {
          type: 'string',
           minLength: 1,
           format: 'date-time',
        },
        // TODO: Confirm if name is part of document
        // name: {
        //   type: 'string',
        // },
        firstSignatoryAuthentication: {
          type: 'object',
          required: ['signature', 'actualDateTime'],
          properties: {
            signature: {
              type: 'string',
               minLength: 1,
            },
            actualDateTime: {
              type: 'string',
               minLength: 1,
               format: 'date-time',
            },
          },
        },
        secondSignatoryAuthentication: {
          type: 'object',
          required: ['signature', 'actualDateTime'],
          properties: {
            signature: {
              type: 'string',
               minLength: 1,
            },
            actualDateTime: {
              type: 'string',
               minLength: 1,
               format: 'date-time',
            },
          },
        },
        isPreferential: {
          type: 'boolean',
        },
        supplyChainConsignment: {
          type: 'object',
          required: [
            'iD',
            'information',
            'exportCountry',
            'consignor',
            'importCountry',
            'consignee',
            'includedConsignmentItems',
            'loadingBaseportLocation',
            'mainCarriageTransportMovement',
          ],
          properties: {
            iD: {
              type: 'string',
              minLength: 1,
            },
            information: {
              type: 'string',
               minLength: 1,
            },
            exportCountry: {
              type: 'object',
              required: ['name'],
              properties: {
                // TODO: Confirm if code is part of document
                // code: {
                //   type: 'string',
                // },
                name: {
                  type: 'string',
                   minLength: 1,
                },
              },
            },
            consignor: {
              type: 'object',
              required: ['iD', 'name', 'postalAddress'],
              properties: {
                iD: {
                  type: 'string',
                   minLength: 1,
                },
                name: {
                  type: 'string',
                   minLength: 1,
                },
                postalAddress: PostalAddress,
              },
            },
            importCountry: {
              type: 'object',
              required: ['name'],
              properties: {
                // TODO: Confirm if code is part of document
                // code: {
                //   type: 'string',
                // },
                name: {
                  type: 'string',
                   minLength: 1,
                },
              },
            },
            consignee: {
              type: 'object',
              required: ['iD', 'name', 'postalAddress'],
              properties: {
                iD: {
                  type: 'string',
                   minLength: 1,
                },
                name: {
                  type: 'string',
                   minLength: 1,
                },
                postalAddress: PostalAddress,
              },
            },
            includedConsignmentItems: {
              type: 'array',
              items: ConsignmentItem,
              minItems: 1,
            },
            loadingBaseportLocation: {
              type: 'object',
              required: ['iD', 'name'],
              properties: {
                iD: {
                  type: 'string',
                   minLength: 1,
                },
                name: {
                  type: 'string',
                   minLength: 1,
                },
              },
            },
            mainCarriageTransportMovement: {
              type: 'object',
              required: ['iD', 'information', 'usedTransportMeans'],
              properties: {
                iD: {
                  type: 'string',
                   minLength: 1,
                },
                information: {
                  type: 'string',
                   minLength: 1,
                },
                usedTransportMeans: {
                  type: 'object',
                  required: ['iD', 'name'],
                  properties: {
                    iD: {
                      type: 'string',
                       minLength: 1,
                    },
                    name: {
                      type: 'string',
                       minLength: 1,
                    },
                  },
                },
                departureEvent: {
                  type: 'object',
                  required: ['departureDateTime'],
                  properties: {
                    departureDateTime: {
                      type: 'string',
                       minLength: 1,
                       format: 'date-time',
                    },
                  },
                },
                unloadingBaseportLocation: {
                  type: 'object',
                  required: ['iD', 'name'],
                  properties: {
                    iD: {
                      type: 'string',
                       minLength: 1,
                    },
                    name: {
                      type: 'string',
                       minLength: 1,
                    },
                  },
                },
              },
            },
          },
        },
        links: {
          type: 'object',
          required: [],
          properties: {
            self: {
              type: 'object',
              required: [],
              properties: {
                href: {
                  type: 'string',
                   minLength: 1,
                },
              },
            },
          },
        },
      },
    },
  },
};

export const GENERIC_SCHEMA = {
  type: 'object',
  required: ['credentialSubject'],
  properties: {
    credentialSubject: {
      type: 'object',
      properties: {
        iD: {
          type: 'string',
          minItems: 1,
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
          minLength: 1,
        },
        importerName: {
          type: 'string',
          minLength: 1,
        },
        consignmentReferenceNumber: {
          type: 'string',
          minLength: 1,
        },
        originalDocument: {
          type: 'string',
          minLength: 1,
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
    },
  },
};
