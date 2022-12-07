import { useReducer, useRef, useState } from 'react';
import {
  FrameActions,
  FrameConnector,
  renderDocument,
  print,
} from '@govtechsg/decentralized-renderer-react-components';
import { obfuscateDocument } from '@govtechsg/open-attestation';
import { Tab, Typography, Box } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  VerifiableCredential,
  WrappedVerifiableCredential,
} from '@dvp/api-interfaces';
import { DEFAULT_RENDERER } from '../constants';
import { VcUtility } from '../VcUtility';

export type VCDocumentState = {
  document?: VerifiableCredential;
};

export enum VCDocumentActionType {
  'Obfuscate' = 'obfuscate',
}

export type VCDocumentAction = {
  type: VCDocumentActionType.Obfuscate;
  payload: string[] | string;
};

// We're implementing a reducer to separate state management.
// This enables the document to be updated and shared across the renderer, viewer and utility
export const reducer = (
  state: VCDocumentState,
  action: VCDocumentAction
): VCDocumentState => {
  switch (action.type) {
    case VCDocumentActionType.Obfuscate: {
      let res = state.document as WrappedVerifiableCredential;
      if (res) {
        res = obfuscateDocument(res, action.payload);
        // Redact self url as well if present
        if (res.credentialSubject.links) {
          res = obfuscateDocument(res, 'credentialSubject.links');
        }
      }
      return { document: res };
    }
    default:
      return state;
  }
};

export interface IRendererViewer {
  document: VerifiableCredential;
}

export const _getRendererURl = (document: VerifiableCredential) => {
  return document?.openAttestationMetadata?.template?.url
    ? document.openAttestationMetadata.template.url
    : DEFAULT_RENDERER;
};

export const RendererViewer = ({ document }: IRendererViewer) => {
  const source = _getRendererURl(document);

  const [height, setHeight] = useState(250);
  const SCROLLBAR_WIDTH = 20; // giving scrollbar a default width as there are no perfect ways to get it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toFrame = useRef<any>();
  const [tabIndex, setTabIndex] = useState('0');

  const [state, dispatchAction] = useReducer(reducer, {
    document,
  });

  const onConnected =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (frame: any) => {
      toFrame.current = frame;
      if (toFrame.current && state.document) {
        toFrame.current(renderDocument({ document: state.document }));
      }
    };

  const dispatch = (action: FrameActions): void => {
    if (action.type === 'UPDATE_HEIGHT') {
      setHeight(action.payload + SCROLLBAR_WIDTH);
    }

    if (action.type === 'OBFUSCATE') {
      dispatchAction({
        type: VCDocumentActionType.Obfuscate,
        payload: action.payload,
      });
    }
  };

  const onPrint = () => {
    if (toFrame.current) {
      toFrame.current(print());
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabIndex(newValue);
  };

  return (
    <>
      {state.document && (
        <VcUtility
          document={state.document}
          onPrint={onPrint}
          isPrintable={tabIndex === '0' ? true : false}
        />
      )}
      <TabContext value={`${tabIndex}`} data-testid={'tabs'}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            marginBottom: '20px',
          }}
        >
          <TabList
            onChange={handleChange}
            aria-label="Display Verifiable Credential"
          >
            <Tab
              aria-label="Render view"
              label="Render"
              sx={{ color: 'black' }}
              value={'0'}
              onFocus={() => {
                setTabIndex('0');
              }}
            />
            <Tab
              aria-label="Json view"
              label="Json"
              sx={{ color: 'black' }}
              value={'1'}
              onFocus={() => {
                setTabIndex('1');
              }}
            />
          </TabList>
        </Box>
        <TabPanel value={'0'} data-testid={'tab-panel-0'}>
          <FrameConnector
            style={{ height: `${height}px`, width: '100%', border: '0px' }}
            source={source}
            dispatch={dispatch}
            onConnected={onConnected}
          />
        </TabPanel>
        <TabPanel value={'1'} data-testid={'tab-panel-1'}>
          <Box
            sx={{
              fontSize: { xs: '11px', sm: '15px' },
              paddingLeft: { xs: 0, sm: '2rem' },
            }}
            tabIndex={0}
            aria-label="JSON version of the Credential subject"
          >
            {state.document?.credentialSubject ? (
              <pre aria-hidden="true" style={{ overflow: 'auto' }}>
                {JSON.stringify(state.document?.credentialSubject, null, 2)}
              </pre>
            ) : (
              <Typography tabIndex={0}>
                Credential subject is empty or does not exist.
              </Typography>
            )}
          </Box>
        </TabPanel>
      </TabContext>
    </>
  );
};
