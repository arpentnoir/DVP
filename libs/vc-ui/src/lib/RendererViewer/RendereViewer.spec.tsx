import { act, render, waitFor } from '@testing-library/react';
import { RendererViewer, _getRendererURl } from './RendererViewer';
import { CHAFTA_COO } from '../fixtures';

describe('RendererViewer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RendererViewer document={CHAFTA_COO} />);
    expect(baseElement).toBeTruthy();
  });

  it('should show VcUtility component', () => {
    const { getByTestId } = render(<RendererViewer document={CHAFTA_COO} />);
    expect(getByTestId('vc-utility')).toBeTruthy();
  });

  it('should show the tabs', async () => {
    const { getByTestId, getByRole } = render(
      <RendererViewer document={CHAFTA_COO} />
    );

    await waitFor(() => {
      expect(getByRole('tab', { selected: true }).textContent).toBe('Render');
      expect(getByRole('tab', { name: 'Json' })).toBeTruthy();
      expect(getByTestId('tab-panel-0')).toBeTruthy();
    });
  });

  it('should switch to the second tab and display the contents', async () => {
    const { getByRole, getByTestId } = render(
      <RendererViewer document={CHAFTA_COO} />
    );

    act(() => {
      getByRole('tab', { name: 'Json' }).click();
    });

    await waitFor(() => {
      expect(getByRole('tab', { selected: true }).textContent).toBe('Json');
      expect(getByTestId('tab-panel-1').textContent).toBe(
        JSON.stringify(CHAFTA_COO.credentialSubject, null, 2)
      );
    });
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
