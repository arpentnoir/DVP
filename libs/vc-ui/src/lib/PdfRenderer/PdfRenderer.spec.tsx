/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/require-await */
import {
  render,
  fireEvent,
  act,
  waitFor,
  screen,
} from '@testing-library/react';
import { PdfRenderer } from './PdfRenderer';
import { AANZFTA_COO_PARTIAL } from '../fixtures';

const urlMock = 'www.example.com';
const originalDocument: string =
  AANZFTA_COO_PARTIAL?.credentialSubject?.['originalDocument'];

describe('PdfRenderer', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render successfully', async () => {
    await act(async () => {
      render(<PdfRenderer pdfDocument={originalDocument} qrUrl={urlMock} />);
    });

    expect(screen.getByTestId('pdf-container')).toBeTruthy();
  });

  it('should show all pages of the document', async () => {
    await act(async () => {
      render(<PdfRenderer pdfDocument={originalDocument} qrUrl={urlMock} />);
    });
    await waitFor(() => {
      expect(screen.getByTestId('page_1')).toBeTruthy();
      expect(screen.getByTestId('page_2')).toBeTruthy();
    });
  });

  it('should show a divider between the pages of the document', async () => {
    await act(async () => {
      render(<PdfRenderer pdfDocument={originalDocument} qrUrl={urlMock} />);
    });
    await waitFor(() => {
      expect(screen.queryByTestId('page_1_divider')).toBeTruthy();
    });
  });

  it('should not show a divider on the last page', async () => {
    await act(async () => {
      render(<PdfRenderer pdfDocument={originalDocument} qrUrl={urlMock} />);
    });
    await waitFor(() => {
      expect(screen.queryByTestId('page_2_divider')).toBeFalsy();
    });
  });

  it('should show a QrCode if a document loaded', async () => {
    await act(async () => {
      render(<PdfRenderer pdfDocument={originalDocument} qrUrl={urlMock} />);
    });
    await waitFor(() => {
      expect(screen.getByTestId('qr-code-element')).toBeTruthy();
    });
  });

  it('should have a resize element if QrCode is displayed', async () => {
    await act(async () => {
      render(<PdfRenderer pdfDocument={originalDocument} qrUrl={urlMock} />);
    });
    await waitFor(() => {
      expect(screen.queryByTestId('qrcode-resize')).toBeTruthy();
    });
  });
});
