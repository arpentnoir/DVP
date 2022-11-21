import { VerifiableCredential } from '@dvp/api-interfaces';
import {
  FrameActions,
  FrameConnector,
  renderDocument,
  updateTemplates,
  print,
} from '@govtechsg/decentralized-renderer-react-components';
import { Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box } from '@mui/system';
import { useCallback, useRef, useState } from 'react';
import { DEFAULT_RENDERER } from '../constants';
import { VcUtility } from '../VcUtility';

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

  const onConnected = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (frame: any) => {
      toFrame.current = frame;
      if (toFrame.current) {
        toFrame.current(renderDocument({ document }));
      }
    },
    [document]
  );

  const dispatch = (action: FrameActions): void => {
    if (action.type === 'UPDATE_HEIGHT') {
      setHeight(action.payload + SCROLLBAR_WIDTH); // adding SCROLLBAR_WIDTH in case the frame content overflow horizontally, which will cause scrollbars to appear
    }

    if (action.type === 'UPDATE_TEMPLATES') {
      updateTemplates(action.payload);
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
      <VcUtility
        document={document}
        onPrint={onPrint}
        isPrintable={tabIndex === '0' ? true : false}
      />
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
            <Tab label="Render" value={'0'} />
            <Tab label="Json" value={'1'} />
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
            aria-label="Credential subject"
          >
            <pre tabIndex={0} style={{ overflow: 'auto' }}>
              {document?.credentialSubject
                ? JSON.stringify(document?.credentialSubject, null, 2)
                : 'Credential subject is empty or does not exist.'}
            </pre>
          </Box>
        </TabPanel>
      </TabContext>
    </>
  );
};
