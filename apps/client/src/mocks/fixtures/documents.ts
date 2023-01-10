export const CHAFTA_COO = {
  version: 'https://schema.openattestation.com/3.0/schema.json',
  credentialSubject: {
    firstSignatoryAuthentication: {},
    supplyChainConsignment: {
      exportCountry: {},
      exporter: {
        postalAddress: {},
      },
      importCountry: {},
      importer: {
        postalAddress: {},
      },
      loadingBaseportLocation: {},
      mainCarriageTransportMovement: {
        usedTransportMeans: {},
        departureEvent: {},
      },
      unloadingBaseportLocation: {},
    },
    iD: 'sdf',
    links: {
      self: {
        href: 'https://dev.dvp.ha.showthething.com?q=%7B%22type%22%3A%22DOCUMENT%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Fapi.dev.dvp.ha.showthething.com%2F0ca1606c-407e-48b4-81f9-29a34dc478fa%22%2C%22key%22%3A%226200a581d643ff9e48bdce5e44d40467ad420125b747559d72ac84a978b628a6%22%2C%22permittedActions%22%3A%5B%22STORE%22%5D%2C%22redirect%22%3A%22https%3A%2F%2Fdev.dvp.ha.showthething.com%2F%22%7D%7D',
      },
    },
  },
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://schemata.openattestation.com/io/tradetrust/certificate-of-origin/1.0/certificate-of-origin-context.json',
    'https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json',
  ],
  type: ['VerifiableCredential', 'OpenAttestationCredential'],
  issuanceDate: '2010-01-01T19:23:24Z',
  openAttestationMetadata: {
    template: {
      type: 'EMBEDDED_RENDERER',
      name: 'CHAFTA_COO',
      url: 'https://generic-templates.tradetrust.io',
    },
    proof: {
      type: 'OpenAttestationProofMethod',
      method: 'DID',
      value: 'did:ethr:0x1245e5b64d785b25057f7438f715f4aa5d965733',
      revocation: {
        type: 'NONE',
      },
    },
    identityProof: {
      type: 'DNS-DID',
      identifier: 'demo-tradetrust.openattestation.com',
    },
  },
  issuer: {
    id: 'https://example.com',
    name: 'DEMO DID',
    type: 'OpenAttestationIssuer',
  },
  network: {
    chain: 'ETH',
    chainId: '5',
  },
  proof: {
    type: 'OpenAttestationMerkleProofSignature2018',
    proofPurpose: 'assertionMethod',
    targetHash:
      'e6ce56175b05d2636cc0fbdaa14d96d173df394de27971a812da2005c7c26c74',
    proofs: [],
    merkleRoot:
      'e6ce56175b05d2636cc0fbdaa14d96d173df394de27971a812da2005c7c26c74',
    salts:
      'W3sidmFsdWUiOiJjNjlmY2VjZjU4YWNiMTA3NzNmNjVlZTZkMGU3YWQ5YjBhZjYyMzgwMjAyMjA2YTQ2ZDhmYTI2NzQyMzU2OGUyIiwicGF0aCI6InZlcnNpb24ifSx7InZhbHVlIjoiZTJkOGMwOTJmZjJlNTc4N2Q0MTNlMTYxZTBhOTRlOGEzYWU3MDE3Mjg2ZDJjN2JhNjFhYzZiMmYyNjc2M2FhMCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5pRCJ9LHsidmFsdWUiOiJkMGJhODAxYTI3NGVhZTQ0ZDg2ODFjOGRiMmViMjFiYWRiZDc4Yjc2YmNlOGNjMTdiMDY1NzE1MjE1ZWJkNWMyIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpbmtzLnNlbGYuaHJlZiJ9LHsidmFsdWUiOiI4ZGZjNWI4ZGUzMGM4MjMxNzJkN2NhZmIwNTMzYjJlZWJjZmI4OTIwNjg4NDlmYzIyZjE4N2U4ZDI5Njg3MTBmIiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6Ijc3MDJjODliYjNkNjJjNjI1MDRiNTE0MmU4NmFmZTAzNDE5MzNhMjg2NTIzNWIxODM5NDA1NTVmMTA3NzcyOTMiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiOTY4MTA2MmIxMzI1NjM4MDNiODQ4ZTUzOTA4YWM1MmEzY2IwOGFhYjRkZDIyZjMwNjVlYjNiZGM1MGNiMWU2OSIsInBhdGgiOiJAY29udGV4dFsyXSJ9LHsidmFsdWUiOiIyNzRmZTdhYjQ4ZWYyYmI3MGM1ZTFjZjJkNmFlYTZkNTE1YzEzMDA4ODE3NTllMmRkMTg3YTE2NzBkOTA3MmE5IiwicGF0aCI6InR5cGVbMF0ifSx7InZhbHVlIjoiMzBkYTRmYzZmMzMwOGFmZjM4OWJjNTRjOTdlNGNmMTViYWVlYWQxM2M0MGE2NzZlZWJhMDMwYWZjMzc3MzllMiIsInBhdGgiOiJ0eXBlWzFdIn0seyJ2YWx1ZSI6IjA5ZjM4M2ExNWMzNTBkYjNiYWExZTE4ZGE1MDA2YWFhMmU2NGEwYTg5MTg0OGFkOWY2ZDhjNTlkYmQ4NmYzNTIiLCJwYXRoIjoiaXNzdWFuY2VEYXRlIn0seyJ2YWx1ZSI6IjBlODBjMGU1NmEzNDZjZjI0NmM5YmY4Yzg1ZjgzM2M2ODhjNDBkNGFiNWU4OWY5OTRjZDI5N2EzYTVjMWIwZDUiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEudGVtcGxhdGUudHlwZSJ9LHsidmFsdWUiOiI3OGNmMGFmYjhiZGM3ZmU5NGE1ODJmNjAwMDY4YmY2NDhkNjRhOWZlNjliMjg1ZjVlNjQ1M2E4MWQzMDIxODZlIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnRlbXBsYXRlLm5hbWUifSx7InZhbHVlIjoiYjcxYjM0MDlmODM1MDVjODExYjYwMmVlNTJiNzRjNDQ2ZTkzNTEyMGFjMjcwYWVkNjlmNDkzYmFmMjNkOThiMyIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS50ZW1wbGF0ZS51cmwifSx7InZhbHVlIjoiZjM1N2NmMGE1NjNmOGI4NDhkZDQzOGRlODQ3NjgzNTJlYzg2MDczMzRhYTMzMWQ2MWU1NTE3NjVjZmFjY2Q4YiIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5wcm9vZi50eXBlIn0seyJ2YWx1ZSI6ImJlNmIwODdhOWY2ZDQ1YmYwMzc3ZmI3YjAyMGY0OGYyMTcwNTc1MTU0NTdiYTkxMWJmZGExZDcwYzUyNmY3ZDUiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YubWV0aG9kIn0seyJ2YWx1ZSI6ImY5N2M5MTNkMzZjNjBmYjlmNzgzZDc4MGE5ZTg1MTNhMDNmNGVjNGU2MTFmNDAyMGM5M2ZhNzBjMGIxMDMzNjciLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YudmFsdWUifSx7InZhbHVlIjoiYTE0NWM5OTM4ZTQ3N2MwODBjYzBkZDhkMjk3MDllMjU3N2ExZmY3MTk5ZTRlMmQxM2FhMmQzZTM5M2U4YmVlNiIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5wcm9vZi5yZXZvY2F0aW9uLnR5cGUifSx7InZhbHVlIjoiZTdjYjJkNWExNjg0NmIxNzBlOGE5N2Y0ZGY1NmQyMzBiOTNhOThkNDIxNGRiMzU2MWNkZjg1YTAxYWVmYmJkNiIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5pZGVudGl0eVByb29mLnR5cGUifSx7InZhbHVlIjoiN2JiZTQ5ZGYzY2M4NTVmM2NhZGJlZWQ1ZmYwZTEwMWRiZjc2YTU0ZjZkMGI5ZjcwOWRjNmVkYjRiNmI2NjJjNiIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5pZGVudGl0eVByb29mLmlkZW50aWZpZXIifSx7InZhbHVlIjoiMGZiNTk4MTJkMjA2ZjExZGZhZjM1MjgxYWFkOTVhYTQ1YmNkNThjYTdjYmQyYjMzYzQxMzEyYTcyMjI3YjU5NCIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiOTc4YWZhY2M0OWJmYWVmNzk1ZmY0NDQ0MzFkYzM0N2UzNTY1MGU2NWY5NjA1NmNmODcxYmY2ZWIwYzcwNjQxZSIsInBhdGgiOiJpc3N1ZXIubmFtZSJ9LHsidmFsdWUiOiI4MzVhM2NlMzdmODZkYjBjN2IwNTI5NzJiMjgzMWUyYmJiMDc4NTVlNDZkZTMxMGZiY2YxOWE0YzczMDA3OTc0IiwicGF0aCI6Imlzc3Vlci50eXBlIn0seyJ2YWx1ZSI6IjM2YTU3YTA5MDI1ZjYwYmRiMjQ4MmEwY2MwYzY4OTBkMGE1ZjNjMTc3YmNlNjIyZDE2MTE5MDRlNDc1M2U2NGQiLCJwYXRoIjoibmV0d29yay5jaGFpbiJ9LHsidmFsdWUiOiI5NTQ4YjU1MTE5MjE5NGU1ZDNiNTFkYTMxZTZkYWY4ZDgzYmI2ZjI0ZGFkYmEwNTZmNTA2NjQ5NjNlNWY1NGVkIiwicGF0aCI6Im5ldHdvcmsuY2hhaW5JZCJ9XQ==',
    privacy: {
      obfuscated: [],
    },
    key: 'did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller',
    signature:
      '0x1098f92c7d320a4c33e86417cb8a99b2beb6a2f965e7d944748d94f5c8263f3616b25e40c99f0016664807c52af24ca84853c0b7d25c87aeddc39ad0a7670f381b',
  },
};

export const SVIP_CHAFTA_COO = {
  version: 'https://schema.openattestation.com/3.0/schema.json',
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://dev-dvp-context.s3.ap-southeast-2.amazonaws.com/AANZFTA-CoO.json',
  ],
  type: ['VerifiableCredential'],
  issuanceDate: '2010-01-01T19:23:24Z',
  issuer: {
    id: 'did:key:z6MkvsJoJF1ucfDbqVsbmTnxypFYCLAKZSuCMjPv4a3yLG3u',
  },
  credentialSubject: {
    isPreferential: true,
    firstSignatoryAuthentication: {
      signature: 'asd',
      actualDateTime: '2022-11-07T19:20:00.000Z',
    },
    secondSignatoryAuthentication: {
      signature: 'asd',
      actualDateTime: '2022-11-07T18:51:00.000Z',
    },
    supplyChainConsignment: {
      exportCountry: {
        name: 'Australia',
      },
      consignor: {
        postalAddress: {
          line1: '161 Collins Street',
          line2: '',
          cityName: 'Melbourne',
          postcode: '3000',
          countrySubDivisionName: 'VIC',
          countryCode: 'AU',
        },
        iD: 'abr.gov.au:abn:55004094599',
        name: 'TREASURY WINE ESTATES VINTNERS LIMITED',
      },
      importCountry: {
        name: 'Singapore',
      },
      consignee: {
        postalAddress: {
          line1: '9 Raffles Place, Republic Plaza',
          line2: '',
          cityName: 'Singapore',
          postcode: '048619',
          countryCode: 'SG',
          countrySubDivisionName: '',
        },
        iD: 'emw-wines.com',
        name: 'East meets west fine wines',
      },
      includedConsignmentItems: [
        {
          crossBorderRegulatoryProcedure: {
            originCriteriaText: 'WP',
          },
          manufacturer: {
            postalAddress: {
              line1: 'Penfolds vineyard',
              line2: '',
              cityName: 'Bordertown',
              postcode: '5268',
              countrySubDivisionName: 'SA',
              countryCode: 'AU',
            },
            iD: 'penfolds.com',
            name: 'Penfolds wine',
          },
          tradeLineItems: [
            {
              invoiceReference: {
                attachedBinaryFile: {
                  uRI: 'https://docs.tweglobal.com/8c624a35-9497-41fb-a548-cb5cf43bac21.pdf',
                },
                iD: 'tweglobal.com:invoice:1122345',
                issueDateTime: '2022-06-02T14:30:00Z',
              },
              tradeProduct: {
                harmonisedTariffCode: {
                  classCode: '2204.21',
                  className: 'Wine of fresh grapes, including fortified wines',
                },
                originCountry: {
                  code: 'AU',
                },
                iD: 'gs1.org:gtin:9325814006194',
                description: 'Bin 23 Pinot Noir 2018',
              },
              transportPackages: [
                {
                  iD: 'gs1.org:sscc:59312345670002345',
                  grossVolume: '0.55 m3',
                  grossWeight: '450 Kg',
                },
                {
                  iD: 'gs1.org:sscc:59312345670002346',
                  grossVolume: '0.55 m3',
                  grossWeight: '450 Kg',
                },
              ],
              sequenceNumber: 1,
            },
          ],
          iD: 'penfolds.com:shipment:4738291',
          information:
            '2 pallets (80 cases) Bin23 Pinot and 2 pallets (80 cases) Bin 28 Shiraz',
        },
        {
          crossBorderRegulatoryProcedure: {
            originCriteriaText: 'PSR',
          },
          manufacturer: {
            postalAddress: {
              line1: '44 Johns way',
              line2: '',
              cityName: 'Red Cliffs',
              postcode: '3496',
              countrySubDivisionName: 'VIC',
              countryCode: 'AU',
            },
            iD: 'lindemans.com',
            name: 'Lindemans wine',
          },
          tradeLineItems: [
            {
              invoiceReference: {
                attachedBinaryFile: {
                  uRI: 'https://docs.tweglobal.com/03e3754c-906d-4f6d-a592-67447c9119e9.pdf',
                },
                iD: 'tweglobal.com:invoice:8877654',
                issueDateTime: '2022-06-05T11:30:00Z',
              },
              tradeProduct: {
                harmonisedTariffCode: {
                  classCode: '2204.21',
                  className: 'Wine of fresh grapes, including fortified wines',
                },
                originCountry: {
                  code: 'AU',
                },
                iD: 'gs1.org:gtin:4088700053621',
                description:
                  'Coonawarra Trio Limestone Ridge Shiraz Cabernet 2013',
              },
              transportPackages: [
                {
                  iD: 'gs1.org:sscc:59312345670002673',
                  grossVolume: '0.58 m3',
                  grossWeight: '465 Kg',
                },
                {
                  iD: 'gs1.org:sscc:59312345670002674',
                  grossVolume: '0.58 m3',
                  grossWeight: '465 Kg',
                },
              ],
              sequenceNumber: 2,
            },
          ],
          iD: 'lindemans.com:shipment:228764',
          information: '2 pallets (80 cases) Limestone Ridge Shiraz red wine',
        },
      ],
      loadingBaseportLocation: {
        iD: 'unece.un.org:locode:AUMEL',
        name: 'Melbourne',
      },
      mainCarriageTransportMovement: {
        usedTransportMeans: {
          iD: 'id:B-2398',
          name: 'airbus A350',
        },
        departureEvent: {
          departureDateTime: '2022-11-07T19:06:00.000Z',
        },
        iD: 'iata.org:CX104',
        information: 'Cathay Pacific Flight CX 104 Melbourne to Singapore',
      },
      unloadingBaseportLocation: {
        iD: 'unece.un.org:locode:SIN',
        name: 'Singapore Changi Airport',
      },
      iD: 'dbschenker.com:hawb:DBS626578',
      information: '6 pallets of fine wine, please store below 20 DegC',
    },
    iD: '23343',
    issueDateTime: '2022-11-07T18:51:00.000Z',
    links: {
      self: {
        href: 'https://web.dev.dvp.ha.showthething.com/verify?q=%7B%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Fapi.dev.dvp.ha.showthething.com%2Fapi%2Fstorage%2Fdocuments%2Fa073cb77-b2dc-4c39-88ac-140ba67b3c24%22%2C%22key%22%3A%226cb83b66265f791e62900cc17bda21f290f8c5a374e641a9db7019fd77053c25%22%7D%7D',
      },
    },
  },
  proof: {
    type: 'Ed25519Signature2018',
    created: '2023-01-10T00:15:49Z',
    verificationMethod:
      'did:key:z6MkvsJoJF1ucfDbqVsbmTnxypFYCLAKZSuCMjPv4a3yLG3u#z6MkvsJoJF1ucfDbqVsbmTnxypFYCLAKZSuCMjPv4a3yLG3u',
    proofPurpose: 'assertionMethod',
    jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..IbXF-WuYrNvM8Wc4pgGq1eDUKLGuzvZs1t2aaKnY14uAGo2blIL8OUb7jCVMNfbGyutLj2hKyzEzCZPDwM-PDA',
  },
};
