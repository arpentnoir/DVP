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
