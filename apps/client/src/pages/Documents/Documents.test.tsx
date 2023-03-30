import { render } from '@dvp/vc-ui';
import { fireEvent, queryByText, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { useQueryApi } from '../../hooks';
import { getVerifiableCredentials } from '../../services';
import { setRevocationStatus } from '../../services/status.service';
import { Documents, errorMessage } from './Documents';

jest.mock('../../services/status.service', () => ({
  setRevocationStatus: jest.fn(),
}));

jest.mock('../../hooks/useQueryApi/useQueryApi', () => {
  return {
    useQueryApi: jest.fn(() => ({
      handleSearch: () => null,
      handleSort: () => null,
      paginationControls: {},
      state: {
        data: [OA_VC],
      },
      setLoading: jest.fn(),
      fetch: jest.fn(),
    })),
  };
});

const OA_VC = {
  id: '62db1aaa-88be-4fd8-a008-b5d6e48b89c7',
  isRevoked: false,
  consignmentReferenceNumber: 'OA2',
  documentDeclaration: true,
  documentNumber: 'OA2',
  issueDate: '2023-03-26T22:51:58.444Z',
  exporterOrManufacturerAbn: 'OA2',
  freeTradeAgreement: 'AANZFTA',
  importerName: 'OA2',
  importingJurisdiction: 'Lao PDR',
  revocationInProgress: false,
  signingMethod: 'OA',
};

describe('Documents', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<Documents />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should pass the error message specified in the documents component into the useQueryApi hook', () => {
    render(<Documents />);

    expect(useQueryApi as jest.Mock).toBeCalledWith(getVerifiableCredentials, {
      errorMessage,
    });
  });

  it('should navigate to the issue page when table action button is clicked', async () => {
    const history = createMemoryHistory();

    const { getByTestId } = render(<Documents />, { navigator: history });

    await waitFor(() => {
      expect(history.location.pathname).not.toBe('/issue');
    });

    fireEvent.click(getByTestId('button:Issue'));

    await waitFor(() => {
      expect(history.location.pathname).toBe('/issue');
    });
  });

  describe('revocation status action', () => {
    it('should submit revocation action to queue if revoke action button is clicked', async () => {
      const { getByTestId, findByText } = render(<Documents />);

      await findByText('ACTIVE');

      fireEvent.click(
        getByTestId(
          'more-info-menu-button:62db1aaa-88be-4fd8-a008-b5d6e48b89c7'
        )
      );

      await waitFor(() =>
        fireEvent.click(getByTestId('more-info-list-item:Revoke'))
      );

      expect(setRevocationStatus as jest.Mock).toBeCalledWith({
        credentialId: '62db1aaa-88be-4fd8-a008-b5d6e48b89c7',
        revoke: true,
        signingMethod: 'OA',
      });
    });

    it('should show IN PROGRESS and disable revocation actions if VC revocation already in progress', async () => {
      (useQueryApi as jest.Mock).mockImplementationOnce(() => ({
        handleSearch: () => null,
        handleSort: () => null,
        paginationControls: {},
        state: {
          data: [{ ...OA_VC, revocationInProgress: true }],
        },
        setLoading: jest.fn(),
        fetch: jest.fn(),
      }));

      const { getByTestId, findByText, queryByTestId } = render(<Documents />);
      fireEvent.click(
        getByTestId(
          'more-info-menu-button:62db1aaa-88be-4fd8-a008-b5d6e48b89c7'
        )
      );

      expect(queryByTestId('more-info-list-item:Revoke')).toBeNull();
      expect(queryByTestId('more-info-list-item:Unrevoke')).toBeNull();
      await findByText('IN PROGRESS');
    });
  });
});
