/**
* @module Documents
* @description This module exports the Documents page component, which displays a
  list of Verifiable Credentials and their details that were issued 
  by the associated ABN of the user, along with options to search,
  sort, and navigate to the issue page.
*/
import { CredentialsResponseItem } from '@dvp/api-client';
import { DataTable, MoreInfo, Text } from '@dvp/vc-ui';
import { Box } from '@mui/material';
import {
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useQueryApi } from '../../hooks/useQueryApi';
import { BaseLayout } from '../../layouts';
import { getVerifiableCredentials } from '../../services';

/**
 * @typedef GridColType
 * @type {object}
 * @property {string} field - The unique identifier for the column.
 * @property {string} headerName - The column's display name in the header.
 * @property {number} flex - The column's flexible width ratio, relative to other columns.
 * @property {boolean} disableColumnMenu - Indicates whether the column menu should be disabled or not.
 * @property {boolean} sortable - Indicates whether the column is sortable or not.
 * @property {number} [minWidth] - The minimum width of the column, if defined.
 * @property {(params: GridRenderCellParams) => JSX.Element} [renderCell] - An optional render function for the column's cells.
 * @property {(params: GridValueFormatterParams) => string} [valueFormatter] - An optional formatter function for the column's cells.

 */
interface GridColType {
  field: string;
  headerName: string;
  flex: number;
  disableColumnMenu: boolean;
  sortable: boolean;
  minWidth?: number;
  renderCell?: (params: GridRenderCellParams) => JSX.Element;
  valueFormatter?: (params: GridValueFormatterParams) => string;
}

/**
 * @type {GridColDef<GridColType>[]}
 * @description The columns configuration for the data table.
 */
const columns: GridColDef<GridColType>[] = [
  {
    field: 'documentNumber',
    headerName: 'Document ID',
    minWidth: 150,
    flex: 1,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'importerName',
    headerName: 'Business Name',
    minWidth: 200,
    flex: 1,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'exporterOrManufacturerAbn',
    headerName: 'ABN',
    minWidth: 210,
    flex: 1,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'freeTradeAgreement',
    headerName: 'Document Type',
    minWidth: 180,
    flex: 1,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'issueDate',
    headerName: 'Issue Date',
    minWidth: 260,
    flex: 1,
    disableColumnMenu: true,
    sortable: true,
  },
  {
    field: 'createdBy',
    headerName: 'Issuer ID',
    minWidth: 150,
    flex: 1,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'isRevoked',
    headerName: 'Document Status',
    minWidth: 170,
    flex: 1,
    disableColumnMenu: true,
    sortable: false,
    valueFormatter: (params: GridValueFormatterParams<boolean>) =>
      params.value ? 'Revoked' : 'Current',
  },
  {
    field: 'moreInfo',
    headerName: '',
    flex: 1,
    renderCell: (params) => (
      <MoreInfo
        params={params}
        items={{ View: () => null, Download: () => null, Revoke: () => null }}
      />
    ),
    disableColumnMenu: true,
    sortable: false,
  },
];

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
  const navigate = useNavigate();

  const handleIssue = () => {
    navigate('/issue');
  };

  const { handleSearch, handleSort, paginationControls, state } =
    useQueryApi<CredentialsResponseItem>(getVerifiableCredentials, {
      errorMessage,
    });

  return (
    <BaseLayout title="Documents">
      <Box paddingBottom="40px">
        <Text variant="h1" fontWeight="bold" paddingBottom="24px">
          Documents
        </Text>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
          fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
          elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
          lectus. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
          egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.
          Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
          lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in
          elementum tellus.
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
      />
    </BaseLayout>
  );
};
