import { render } from '@testing-library/react';
import { RendererViewer, _getRendererURl } from './RendererViewer';
import { CHAFTA_COO } from '../fixtures';

describe('RendererViewer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RendererViewer document={CHAFTA_COO} />);
    expect(baseElement).toBeTruthy();
  });
});

describe('_getRendererURl', () => {
  it('should return renderer url if url is specified in document', () => {
    CHAFTA_COO.openAttestationMetadata.template.url = 'http://soopadoopa.com';
    const res = _getRendererURl(CHAFTA_COO);
    expect(res).toStrictEqual('http://soopadoopa.com');
  });

  it('should return default renderer url if url is not specified in document', () => {
    CHAFTA_COO.openAttestationMetadata.template.url = '';

    const res = _getRendererURl(CHAFTA_COO);
    expect(res).toStrictEqual('https://generic-templates.tradetrust.io');
  });
});
