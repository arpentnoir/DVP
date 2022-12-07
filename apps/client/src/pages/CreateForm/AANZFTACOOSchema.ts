const postalAddressData = {
  type: 'object',
  properties: {
    line1: {
      type: 'string',
    },
    line2: {
      type: 'string',
    },
    cityName: {
      type: 'string',
    },
    postcode: {
      type: 'string',
    },
    countrySubDivisionName: {
      type: 'string',
    },
    countryCode: {
      type: 'string',
    },
  },
}


const postalAddressDataRequired = {
  ...postalAddressData,
  required: ['line1', 'cityName', 'postcode', 'countryCode'],
}



export const schema = {
  type: 'object',
  properties: {
    iD: {
      type: 'string',
      title: 'Certificate Number',
    },
    issueDateTime: {
      type: 'string',
      format: 'date-time',
      label: 'Issue Date and Time',
    },
    firstSignatoryAuthentication: {
      type: 'object',
      properties: {
        signature: { type: 'string' },
        actualDateTime: {
          type: 'string',
          format: 'date-time',
          label: 'Actual Date and Time',
        },
      },
      required: ['signature'],
    },
    secondSignatoryAuthentication: {
      type: 'object',
      properties: {
        signature: { type: 'string' },
        actualDateTime: {
          type: 'string',
          format: 'date-time',
          label: 'Actual Date and Time',
        },
      },
      required: ['signature'],
    },
    isPreferential: {
      type: 'boolean',
      title: 'Preferential Treatment Given Under AANZFTA',
    },
    supplyChainConsignment: {
      type: 'object',
      properties: {
        iD: {
          type: 'string',
          title: 'Id',
        },
        information: {
          type: 'string',
        },
        exportCountry: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
          required: ['name'],
        },
        importCountry: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
          required: ['name'],
        },
        consignor: {
          type: 'object',
          properties: {
            iD: {
              type: 'string',
              title: 'ABN',
            },
            name: {
              type: 'string',
            },
            postalAddress: postalAddressDataRequired,
          },
          required: ['iD', 'name', 'postalAddress'],
        },
        consignee: {
          type: 'object',
          properties: {
            iD: {
              type: 'string',
              title: 'ABN',
            },
            name: {
              type: 'string',
            },
            postalAddress: postalAddressDataRequired,
          },
          required: ['iD', 'name', 'postalAddress'],
        },

        loadingBaseportLocation: {
          type: 'object',
          properties: {
            iD: {
              type: 'string',
              title: 'Port of Discharge',
            },
            name: {
              type: 'string',
            },
          },
          required: ['name'],
        },
        mainCarriageTransportMovement: {
          type: 'object',
          properties: {
            iD: {
              type: 'string',
              title: 'Id',
            },
            information: {
              type: 'string',
            },
            usedTransportMeans: {
              type: 'object',
              properties: {
                iD: {
                  type: 'string',
                  title: 'Vessel / Aircraft Number',
                },
                name: {
                  type: 'string',
                },
              },
              required: ['iD'],
            },
            departureEvent: {
              type: 'object',
              properties: {
                departureDateTime: {
                  type: 'string',
                  title: 'Shipment Date and Time',
                  format: 'date-time',
                },
              },
              required: ['departureDateTime'],
            },
          },
          required: ['usedTransportMeans', 'departureEvent'],
        },
        unloadingBaseportLocation: {
          type: 'object',
          properties: {
            iD: {
              type: 'string',
              title: 'Id',
            },
            name: {
              type: 'string',
            },
          },
          required: ['iD'],
        },
        includedConsignmentItems: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              iD: {
                type: 'string',
                title: 'Id',
              },
              information: {
                type: 'string',
              },
              crossBorderRegulatoryProcedure: {
                type: 'object',
                properties: {
                  originCriteriaText: {
                    type: 'string',
                    title: 'Origin',
                  },
                },
                required: ['originCriteriaText'],
              },
              manufacturer: {
                type: 'object',
                properties: {
                  iD: {
                    type: 'string',
                    title: 'Id',
                  },
                  name: {
                    type: 'string',
                  },
                  postalAddress: postalAddressData,
                },
              },
              tradeLineItems: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    sequenceNumber: {
                      type: 'number',
                    },
                    invoiceReference: {
                      type: 'object',
                      properties: {
                        iD: {
                          type: 'string',
                          title: 'Invoice Number',
                        },
                        issueDateTime: {
                          type: 'string',
                          format: 'date-time',
                          title: 'Invoice Date and Time',
                        },
                        attachedBinaryFile: {
                          type: 'object',
                          properties: {
                            uRI: {
                              type: 'string',
                              title:"URI"
                            },
                          },
                        },
                      },
                      required: ['issueDateTime', 'iD'],
                    },
                    tradeProduct: {
                      type: 'object',
                      properties: {
                        iD: {
                          type: 'string',
                          title: 'Id',
                        },
                        description: {
                          type: 'string',
                        },
                        harmonisedTariffCode: {
                          type: 'object',
                          properties: {
                            classCode: {
                              type: 'string',
                            },
                            className: {
                              type: 'string',
                            },
                          },
                        },
                        originCountry: {
                          type: 'object',
                          properties: {
                            code: {
                              type: 'string',
                            },
                          },
                        },
                      },
                      required: ['description'],
                    },
                    transportPackages: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          iD: {
                            type: 'string',
                            title: 'Id',
                          },
                          grossVolume: {
                            type: 'string',
                            title: 'Gross Volume',
                          },
                          grossWeight: {
                            type: 'string',
                            title: 'Gross Weight',
                          },
                        },
                        required: ['iD', 'grossVolume', 'grossWeight'],
                      },
                    },
                  },
                  required: [
                    'sequenceNumber',
                    'invoiceReference',
                    'tradeProduct',
                    'transportPackages',
                  ],
                },
              },
            },
            required: ['crossBorderRegulatoryProcedure'],
          },
        },
      },
      required: [
        'mainCarriageTransportMovement',
        'consignee',
        'importCountry',
        'exportCountry',
        'consignor',
        'unloadingBaseportLocation',
      ],
    },
  },
  required: ['supplyChainConsignment', 'firstSignatoryAuthentication' ,'secondSignatoryAuthentication'],
};
export const schemaUI = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/iD',
        },
        {
          type: 'Control',
          scope: '#/properties/issueDateTime',
        },
      ],
    },
    {
      type: 'Control',
      scope: '#/properties/isPreferential',
    },
    {
      type: 'Group',
      label: 'First Signatory Authentication',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope:
                '#/properties/firstSignatoryAuthentication/properties/signature',
              label:"Signature"
            },
            {
              type: 'Control',
              scope:
                '#/properties/firstSignatoryAuthentication/properties/actualDateTime',
            },
          ],
        },
      ],
    },
    {
      type: 'Group',
      label: 'Second Signatory Authentication',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope:
                '#/properties/secondSignatoryAuthentication/properties/signature',
              label:"Signature"
            },
            {
              type: 'Control',
              scope:
                '#/properties/secondSignatoryAuthentication/properties/actualDateTime',
            },
          ],
        },
      ],
    },
    {
      type: 'Group',
      label: 'Supply Chain Consignment',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/supplyChainConsignment/properties/iD',
            },
            {
              type: 'Control',
              scope:
                '#/properties/supplyChainConsignment/properties/information',
            },
          ],
        },
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope:
                '#/properties/supplyChainConsignment/properties/exportCountry/properties/name',
              label: 'Export Country Name',
            },
            {
              type: 'Control',
              scope:
                '#/properties/supplyChainConsignment/properties/importCountry/properties/name',
              label: 'Import Country Name',
            },
          ],
        },
        {
          type: 'Group',
          label: 'Consignor',
          elements: [
            {
              type: 'HorizontalLayout',
              elements: [
                {
                  type: 'Control',
                  scope:
                    '#/properties/supplyChainConsignment/properties/consignor/properties/iD',
                  label:"ABN"
                },
                {
                  type: 'Control',
                  scope:
                    '#/properties/supplyChainConsignment/properties/consignor/properties/name',
                    label:"Name"
                },
              ],
            },
            {
              type: 'Label',
              text: 'Postal Address',
            },
            {
              type: 'Control',
              scope:
                '#/properties/supplyChainConsignment/properties/consignor/properties/postalAddress/properties/line1',
                label:"Line 1"
            },
            {
              type: 'Control',
              scope:
                '#/properties/supplyChainConsignment/properties/consignor/properties/postalAddress/properties/line2',
            },
            {
              type: 'HorizontalLayout',
              elements: [
                {
                  type: 'Control',
                  scope:
                    '#/properties/supplyChainConsignment/properties/consignor/properties/postalAddress/properties/cityName',
                    label:"City Name"
                },
                {
                  type: 'Control',
                  scope:
                    '#/properties/supplyChainConsignment/properties/consignor/properties/postalAddress/properties/postcode',
                    label:"Post Code"
                },
              ],
            },
            {
              type: 'HorizontalLayout',
              elements: [
                {
                  type: 'Control',
                  scope:
                    '#/properties/supplyChainConsignment/properties/consignor/properties/postalAddress/properties/countrySubDivisionName',
                },
                {
                  type: 'Control',
                  scope:
                    '#/properties/supplyChainConsignment/properties/consignor/properties/postalAddress/properties/countryCode',
                    label:"Country Code"
                },
              ],
            },
          ],
        },
        {
          type: 'Group',
          label: 'Consignee',
          elements: [
            {
              type: 'HorizontalLayout',
              elements: [
                {
                  type: 'Control',
                  scope:
                    '#/properties/supplyChainConsignment/properties/consignee/properties/iD',
                    label:"ABN"
                },
                {
                  type: 'Control',
                  scope:
                    '#/properties/supplyChainConsignment/properties/consignee/properties/name',
                    label:"Name"
                },
              ],
            },
            {
              type: 'Label',
              text: 'Postal Address',
            },
            {
              type: 'Control',
              scope:
                '#/properties/supplyChainConsignment/properties/consignee/properties/postalAddress/properties/line1',
                label:"Line 1"
            },
            {
              type: 'Control',
              scope:
                '#/properties/supplyChainConsignment/properties/consignee/properties/postalAddress/properties/line2',
            },
            {
              type: 'HorizontalLayout',
              elements: [
                {
                  type: 'Control',
                  scope:
                    '#/properties/supplyChainConsignment/properties/consignee/properties/postalAddress/properties/cityName',
                    label:"City Name"
                },
                {
                  type: 'Control',
                  scope:
                    '#/properties/supplyChainConsignment/properties/consignee/properties/postalAddress/properties/postcode',
                    label:"Post Code"
                },
              ],
            },
            {
              type: 'HorizontalLayout',
              elements: [
                {
                  type: 'Control',
                  scope:
                    '#/properties/supplyChainConsignment/properties/consignee/properties/postalAddress/properties/countrySubDivisionName',
                },
                {
                  type: 'Control',
                  scope:
                    '#/properties/supplyChainConsignment/properties/consignee/properties/postalAddress/properties/countryCode',
                    label:"Country Code"
                },
              ],
            },
          ],
        },
        {
          type: 'Group',
          label: 'Loading Baseport Location',
          elements: [
            {
              type: 'Control',
              scope:
                '#/properties/supplyChainConsignment/properties/loadingBaseportLocation/properties/iD',
            },

            {
              type: 'Control',
              scope:
                '#/properties/supplyChainConsignment/properties/loadingBaseportLocation/properties/name',
                label: "Name"
            },
          ],
        },
        {
          type: 'Group',
          label: 'Main Carriage Transport Movement',
          elements: [
            {
              type: 'Control',
              scope:
                '#/properties/supplyChainConsignment/properties/mainCarriageTransportMovement/properties/iD',
            },
            {
              type: 'Control',
              scope:
                '#/properties/supplyChainConsignment/properties/mainCarriageTransportMovement/properties/information',
            },
            {
              type: 'Control',
              scope:
                '#/properties/supplyChainConsignment/properties/mainCarriageTransportMovement/properties/departureEvent/properties/departureDateTime',
                label: "Departure Date Time"
            },
            {
              type: 'Label',
              text: 'Used Transport Means',
            },
            {
              type: 'Control',
              scope:
                '#/properties/supplyChainConsignment/properties/mainCarriageTransportMovement/properties/usedTransportMeans/properties/iD',
                label: "Vessel / Aircraft Number"
            },
            {
              type: 'Control',
              scope:
                '#/properties/supplyChainConsignment/properties/mainCarriageTransportMovement/properties/usedTransportMeans/properties/name',
            },
          ],
        },
        {
          type: 'Group',
          label:"Unloading Baseport Location",
            elements: [
              {
                type: 'Control',
                scope:
                  '#/properties/supplyChainConsignment/properties/unloadingBaseportLocation/properties/iD',
                  label:"Id"
              },
              {
                type: 'Control',
                scope:
                  '#/properties/supplyChainConsignment/properties/unloadingBaseportLocation/properties/name',
                  label:"Name"
              },
            ],
        },
        {
          type: 'Control',
          scope: '#/properties/supplyChainConsignment/properties/includedConsignmentItems',
          options: {
            detail: {
              type: "VerticalLayout",
              elements: [
                {
                  type: 'Control',
                  scope: '#/properties/iD',
                },
                {
                  type: 'Control',
                  scope: '#/properties/information',
                },
                {
                  type: 'Label',
                  text: 'Cross Border Regulatory Procedure',
                },
                {
                  type: 'Control',
                  scope: '#/properties/crossBorderRegulatoryProcedure/properties/originCriteriaText',
                  label:"Origin"
                },
                {
                  type: 'Label',
                  text: 'Manufacturer',
                },
                {
                  type: 'Control',
                  scope: '#/properties/manufacturer/properties/iD',
                },
                {
                  type: 'Control',
                  scope: '#/properties/manufacturer/properties/name',
                },
                {
                  type: 'Control',
                  scope: '#/properties/manufacturer/properties/postalAddress',
                },
                {
                  type: 'Control',
                  scope: '#/properties/tradeLineItems',
                  options: {
                    detail: {
                      type: "VerticalLayout",
                      elements: [
                        {
                          type: 'Control',
                          scope: '#/properties/sequenceNumber',
                          label:"Sequence Number"
                        },
                        {
                          type: 'Group',
                          scope: '#/properties/invoiceReference',
                          label:"Invoice Reference",
                          elements: [
                            {
                              type: 'Control',
                              scope: '#/properties/invoiceReference/properties/iD',
                              label:"Invoice Number"
                            },
                            {
                              type: 'Control',
                              scope: '#/properties/invoiceReference/properties/issueDateTime',
                              label:"Issue Date Time"
                            },
                          ]
                        },
                        {
                          scope: '#/properties/tradeProduct',
                          type: 'Group',
                          label:"Trade Product",
                          elements: [
                            {
                              type: 'Control',
                              scope: '#/properties/tradeProduct/properties/iD',
                              label:"Id"
                            },
                            {
                              type: 'Control',
                              scope: '#/properties/tradeProduct/properties/description',
                              label:"Description"
                            },
                            {
                              type: 'Control',
                              scope: '#/properties/tradeProduct/properties/harmonisedTariffCode',
                            },
                            {
                              type: 'Control',
                              scope: '#/properties/tradeProduct/properties/originCountry',
                            },
                          ]
                        },
                        {
                          type: 'Control',
                          scope: '#/properties/transportPackages',
                          options: {
                            detail: {
                              type: "HorizontalLayout",
                              elements: [
                                {
                                  type: 'Control',
                                  scope: '#/properties/iD',
                                  label: 'Id',
                                },
                                {
                                  type: 'Control',
                                  scope: '#/properties/grossVolume',
                                  label: 'Gross Volume',
                                },
                                {
                                  type: 'Control',
                                  scope: '#/properties/grossWeight',
                                  label: 'Gross Weight',
                                },
                              ]
                            }
                          }
                        }

                      ]
                    }
                  },
                },
              ],
            },
          },
        },
      ],
    },
  ],
};


export const sampleData = {
  "iD": "678888777",
  "issueDateTime": "2022-11-28T12:59:00+11:00",
  "firstSignatoryAuthentication": {
      "signature": "Bob",
      "actualDateTime": "2022-11-29T00:00:00+11:00"
  },
  "secondSignatoryAuthentication": {
      "signature": "Gary",
      "actualDateTime": "2022-11-28T12:00:00+11:00"
  },
  "supplyChainConsignment": {
      "exportCountry": {
          "name": "Australia"
      },
      "importCountry": {
          "name": "Singapore"
      },
      "consignor": {
          "iD": "65667-88776-80998778-89898988-8787988",
          "name": "Bobs Builders",
          "postalAddress": {
              "line1": "1 Builders Lane",
              "postcode": "0000",
              "countryCode": "AUD",
              "cityName": "Bobtown"
          }
      },
      "consignee": {
          "iD": "7777777777777777777",
          "postalAddress": {
              "line1": "5 Street name",
              "cityName": "Singapore",
              "postcode": "6556",
              "countryCode": "SGP"
          },
          "name": "Bills Construction"
      },
      "loadingBaseportLocation": {
          "name": "ggyy78"
      },
      "mainCarriageTransportMovement": {
          "departureEvent": {
              "departureDateTime": "2022-11-29T00:00:00+11:00"
          },
          "usedTransportMeans": {
              "iD": "QF 101"
          }
      },
      "unloadingBaseportLocation": {
          "iD": "Brisbane"
      },
      "includedConsignmentItems": [
          {
              "iD": "6",
              "information": "Building equipment",
              "tradeLineItems": [
                  {
                      "sequenceNumber": 555.5,
                      "invoiceReference": {
                          "iD": "876ffJ",
                          "issueDateTime": "2022-11-16T00:00:00+11:00"
                      },
                      "tradeProduct": {
                          "description": "excavator"
                      },
                      "transportPackages": [
                          {
                              "iD": "HH99",
                              "grossVolume": "987",
                              "grossWeight": "1.8T"
                          }
                      ]
                  },
                  {
                      "sequenceNumber": 777.99,
                      "invoiceReference": {
                          "iD": "798",
                          "issueDateTime": "2022-11-29T12:00:00+11:00"
                      },
                      "tradeProduct": {
                          "description": "excavator parts"
                      },
                      "transportPackages": [
                          {
                              "iD": "8889",
                              "grossVolume": "799",
                              "grossWeight": "800kg"
                          }
                      ]
                  }
              ],
              "crossBorderRegulatoryProcedure": {
                  "originCriteriaText": "WO"
              }
          },
          {
              "iD": "9",
              "crossBorderRegulatoryProcedure": {
                  "originCriteriaText": "WO"
              },
              "tradeLineItems": [
                  {
                      "sequenceNumber": 987789,
                      "invoiceReference": {
                          "iD": "998878",
                          "issueDateTime": "2022-11-29T12:00:00+11:00"
                      },
                      "tradeProduct": {
                          "description": "Tools"
                      },
                      "transportPackages": [
                          {
                              "iD": "9909",
                              "grossVolume": "5",
                              "grossWeight": "10kg"
                          }
                      ]
                  }
              ]
          }
      ]
  }
}
