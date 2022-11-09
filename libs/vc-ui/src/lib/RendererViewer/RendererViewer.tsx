import {
  FrameActions,
  FrameConnector,
  renderDocument,
  updateTemplates,
} from '@govtechsg/decentralized-renderer-react-components';
import { useCallback, useRef, useState } from 'react';
import { DEFAULT_RENDERER } from '../constants';

export interface IRendererViewer {
  document: any;
}

export const _getRendererURl = (document: any) => {
  return document?.openAttestationMetadata?.template?.url
    ? document.openAttestationMetadata.template.url
    : DEFAULT_RENDERER;
};

export const RendererViewer = ({ document }: IRendererViewer) => {
  const source = _getRendererURl(document);

  const [height, setHeight] = useState(250);
  const SCROLLBAR_WIDTH = 20; // giving scrollbar a default width as there are no perfect ways to get it
  const toFrame = useRef<any>();

  const onConnected = useCallback(
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

  return (
    <FrameConnector
      style={{ height: `${height}px`, width: '100%', border: '0px' }}
      source={source}
      dispatch={dispatch}
      onConnected={onConnected}
    />
  );
};
