/**
* @module Documents
* @description This module exports the Documents page component, which displays a
  list of Verifiable Credentials and their details that were issued
  by the associated ABN of the user, along with options to search,
  sort, and navigate to the issue page.
*/
import {
  CredentialsResponseItem,
  IssueCredentialRequestSigningMethodEnum,
} from '@dvp/api-client';
import { DataTable, MoreInfo, Text } from '@dvp/vc-ui';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { AmplifyUser } from '@aws-amplify/ui';
import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryApi } from '../../hooks/useQueryApi';
import { BaseLayout } from '../../layouts';
import { getVerifiableCredentials } from '../../services';
import { setRevocationStatus } from '../../services/status.service';
import { useMemo } from 'react';
import { RevocationAction, RevocationStatus } from '../../constants';

type CredentialRecord = {
  id: string;
  documentNumber: string;
  consignmentReferenceNumber: string;
  exporterOrManufacturerAbn: string;
  issueDate: string;
  importerName: string;
  importingJurisdiction: string;
  isRevoked: boolean;
  revocationInProgress: boolean;
  signingMethod: string;
};

/**
 * @const {string} errorMessage
 * @description The error message to be displayed when an error occurs while fetching the Verifiable Credentials.
 */
export const errorMessage =
  'An error occurred while fetching the Verifiable Credentials';

/**
* @function Documents
* @description A component that displays a list of Verifiable Credentials and their details
  that were issued by the associated ABN of the user, along with options to search,
  sort, and navigate to the issue page.
* @returns {JSX.Element} The rendered Documents component.
*/
export const Documents = () => {
  const {
    handleSearch,
    handleSort,
    paginationControls,
    state,
    fetch,
    setLoading,
    setErrorMesssage,
  } = useQueryApi<CredentialsResponseItem>(getVerifiableCredentials, {
    errorMessage,
  });

  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>();

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user: AmplifyUser) => {
        if (user.username) setUserName(user.username);
        else setUserName('Issuer');
      })
      .catch(() => {
        setUserName('Issuer');
      });
  });

  const handleIssue = () => {
    navigate('/issue');
  };

  /**
   * @type {GridColDef<CredentialRecord>[]}
   * @description The columns configuration for the data table.
   */
  const columns: GridColDef<CredentialRecord>[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        minWidth: 350,
        flex: 1,
        disableColumnMenu: true,
        sortable: false,
      },
      {
        field: 'documentNumber',
        headerName: 'Document Number',
        minWidth: 200,
        flex: 1,
        disableColumnMenu: true,
        sortable: false,
      },
      {
        field: 'consignmentReferenceNumber',
        headerName: 'Consignment Number',
        minWidth: 240,
        flex: 1,
        disableColumnMenu: true,
        sortable: false,
      },
      {
        field: 'exporterOrManufacturerAbn',
        headerName: 'Exporter Or Manufacturer Abn',
        minWidth: 280,
        flex: 1,
        disableColumnMenu: true,
        sortable: false,
      },
      {
        field: 'issueDate',
        headerName: 'Date Issued',
        minWidth: 270,
        flex: 1,
        disableColumnMenu: true,
        sortable: true,
      },
      {
        field: 'importerName',
        headerName: 'Importer Name',
        minWidth: 240,
        flex: 1,
        disableColumnMenu: true,
        sortable: false,
      },
      {
        field: 'importingJurisdiction',
        headerName: 'Importing Jurisdiction',
        minWidth: 200,
        flex: 1,
        disableColumnMenu: true,
        sortable: false,
      },
      {
        field: 'isRevoked',
        headerName: 'Revocation Status',
        minWidth: 150,
        flex: 1,
        disableColumnMenu: true,
        sortable: false,
        renderCell: (params) => {
          const status = params.row.revocationInProgress
            ? RevocationStatus.IN_PROGRESS
            : params.row.isRevoked
            ? RevocationStatus.REVOKED
            : RevocationStatus.ACTIVE;

          return status;
        },
      },
      {
        field: 'moreInfo',
        headerName: '',
        flex: 1,
        renderCell: (params) => {
          return (
            <MoreInfo
              params={params}
              items={{
                View: () => null,
                Download: () => null,

                // Function handler for setting the revocation status of a VC in Data Table
                // Only show action if revocation is NOT in progress
                ...(!params.row.revocationInProgress &&
                  params.row.isRevoked !== true && {
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    [RevocationAction.REVOKE]: async () => {
                      try {
                        setLoading(true);
                        await setRevocationStatus({
                          credentialId: params.row.id,
                          revoke: !params.row.isRevoked,
                          signingMethod: params.row
                            .signingMethod as IssueCredentialRequestSigningMethodEnum,
                        });

                        await fetch();
                        return;
                      } catch (err: any) {
                        setErrorMesssage(err.message as string);
                        setLoading(false);
                      }
                    },
                  }),
              }}
            />
          );
        },
        disableColumnMenu: true,
        sortable: false,
      },
    ],
    [state, fetch, paginationControls]
  );

  return (
    <BaseLayout title="Documents">
      <Box paddingBottom="40px">
        <Text variant="h1" fontWeight="bold" paddingBottom="24px">
          Documents
        </Text>
        <Text>
          This page shows documents that have been issued by {userName}. To find
          a particular document, use the search fields.
        </Text>
        <Text variant="h3" fontWeight="bold" paddingTop="40px">
          Documents issued
        </Text>
        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
      </Box>

      <DataTable
        handleAction={handleIssue}
        toolBarActionLabel="Issue"
        handleOnSort={handleSort}
        handleOnSearch={handleSearch}
        columns={columns}
        rows={state.data ? state.data : []}
        paginationControls={paginationControls}
        isLoading={state.isLoading}
        error={state.errorMessage}
        checkboxSelection
        // For JSDOM, virtualization needs to be disabled for all fields to be rendered
        disableVirtualization={process.env['NODE_ENV'] === 'test'}
      />
    </BaseLayout>
  );
};
