import { DataTable, Text } from '@dvp/vc-ui';
import { Box, Chip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { Link, useNavigate } from 'react-router-dom';
import { BaseLayout } from '../../layouts';

// TODO: Replace with real data
const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    minWidth: 200,
    flex: 1,
    disableColumnMenu: true,
  },
  {
    field: 'ABN',
    headerName: 'ABN',
    minWidth: 150,
    flex: 1,
    disableColumnMenu: true,
  },
  {
    field: 'businessName',
    headerName: 'Business name',
    minWidth: 150,
    flex: 1,
    disableColumnMenu: true,
  },
  {
    field: 'status',
    headerName: 'Account status',
    minWidth: 150,
    flex: 1,
    disableColumnMenu: true,
    renderCell: (params: any) => {
      return (
        <Chip
          color={params.formattedValue === 'active' ? 'primary' : 'error'}
          label={params.formattedValue}
          sx={{ textTransform: 'capitalize' }}
        />
      );
    },
  },
  {
    field: 'moreInfo',
    headerName: '',
    flex: 1,
    renderCell: (params) => {
      return (
        <Link
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          to={`/issuers/${params.row.businessName}`}
        >
          <Text sx={{ textDecoration: 'underline' }} color="error"></Text>
          Schemas
        </Link>
      );
    },
    disableColumnMenu: true,
    sortable: false,
  },
];

const rows = [
  {
    id: '5940107005302237590',
    status: 'active',
    businessName: 'ABC Widgets',
    ABN: '1234 5678 90',
  },
  {
    id: '5940107005302237591',
    status: 'inactive',
    businessName: 'XYZ Industries',
    ABN: '1234 5678 91',
  },
  {
    id: '5940107005302237592',
    status: 'active',
    businessName: 'STU Supplies',
    ABN: '1234 5678 92',
  },
  {
    id: '5940107005302237593',
    status: 'inactive',
    businessName: 'DEF Cybernetics',
    ABN: '1234 5678 93',
  },
  {
    id: '5940107005302237594',
    status: 'inactive',
    businessName: 'GHI Wineries',
    ABN: '1234 5678 94',
  },
  {
    id: '5940107005302237595',
    status: 'active',
    businessName: 'JKL Commodities',
    ABN: '1234 5678 95',
  },
  {
    id: '5940107005302237596',
    status: 'inactive',
    businessName: 'MNO Foundation',
    ABN: '1234 5678 96',
  },
  {
    id: '5940107005302237597',
    status: 'inactive',
    businessName: 'PQR Electronics',
    ABN: '1234 5678 97',
  },
  {
    id: '5940107005302237598',
    status: 'active',
    businessName: 'VW Cards',
    ABN: '1234 5678 98',
  },
];

export const Issuers = () => {
  const navigate = useNavigate();

  const handleIssue = () => {
    navigate('/issue');
  };

  return (
    <BaseLayout title="Issuers">
      <Box paddingBottom="40px">
        <Text variant="h1" fontWeight="bold" paddingBottom="24px">
          Issuers
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
      </Box>

      <DataTable
        handleAction={handleIssue}
        rows={rows}
        columns={columns}
        rowCount={5}
        pageSizeOptions={[5]}
        checkboxSelection
      />
    </BaseLayout>
  );
};
