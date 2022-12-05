import { render, fireEvent, waitFor } from '@testing-library/react';
import { CertificateUpload } from './CertificateUpload';

const handleFiles = jest.fn();
const ACCEPT_MESSAGE = 'Max 3MB';
const ERROR_MESSAGE = 'Something went wrong';

describe('CertificateUpload', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <CertificateUpload
        handleFiles={handleFiles}
        acceptMessage={ACCEPT_MESSAGE}
        errorMessage=""
      />
    );
    expect(baseElement).toBeTruthy();
  });

  it('should display correct instruction text', () => {
    const { getByText } = render(
      <CertificateUpload
        handleFiles={handleFiles}
        acceptMessage={ACCEPT_MESSAGE}
        errorMessage=""
      />
    );

    getByText('Drag and drop your file here');
    getByText('or');
    getByText('Max 3MB');
  });

  it('should display error message if present', () => {
    let baseElement = render(
      <CertificateUpload
        handleFiles={handleFiles}
        acceptMessage={ACCEPT_MESSAGE}
        errorMessage=""
      />
    );

    expect(baseElement.queryByText('Something went wrong')).toBeFalsy();

    baseElement = render(
      <CertificateUpload
        handleFiles={handleFiles}
        acceptMessage={ACCEPT_MESSAGE}
        errorMessage={ERROR_MESSAGE}
      />
    );

    expect(baseElement.queryByText('Something went wrong')).toBeTruthy();
  });

  it('should display error message if present', () => {
    let baseElement = render(
      <CertificateUpload
        handleFiles={handleFiles}
        acceptMessage={ACCEPT_MESSAGE}
        errorMessage=""
      />
    );

    expect(baseElement.queryByText('Something went wrong')).toBeFalsy();

    baseElement = render(
      <CertificateUpload
        handleFiles={handleFiles}
        acceptMessage={ACCEPT_MESSAGE}
        errorMessage={ERROR_MESSAGE}
      />
    );

    expect(baseElement.queryByText('Something went wrong')).toBeTruthy();
  });

  it('should call handleFiles on upload', async () => {
    const baseElement = render(
      <CertificateUpload
        handleFiles={handleFiles}
        acceptMessage={ACCEPT_MESSAGE}
        errorMessage=""
      />
    );

    const uploadElement = baseElement.getByTestId('input-file-upload');

    await waitFor(() =>
      fireEvent.change(uploadElement, {
        target: { files: ['{"test": "hello"}'] },
      })
    );

    expect(handleFiles).toHaveBeenCalledWith(['{"test": "hello"}']);
  });
});
