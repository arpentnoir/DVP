import { DataTable, Text } from '@dvp/vc-ui';
import { Box, Checkbox, Link, Stack } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';
import { BaseLayout } from '../layouts';

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
    field: 'moreInfo',
    headerName: '',
    flex: 1,
    renderCell: (params) => (
      <Link sx={{ textDecoration: 'underline' }} color="error">
        Remove
      </Link>
    ),
    disableColumnMenu: true,
    sortable: false,
  },
];

const rows = [
  {
    id: '5940107005302237590',

    businessName: 'Organisation',
    ABN: '1234 5678 90',
  },
  {
    id: '5940107005302237591',
    status: 'inactive',
    businessName: 'Organisation',
    ABN: '1234 5678 91',
  },
  {
    id: '5940107005302237592',

    businessName: 'Organisation',
    ABN: '1234 5678 92',
  },
  {
    id: '5940107005302237593',
    status: 'inactive',
    businessName: 'Organisation',
    ABN: '1234 5678 93',
  },
  {
    id: '5940107005302237594',
    status: 'inactive',
    businessName: 'Organisation',
    ABN: '1234 5678 94',
  },
  {
    id: '5940107005302237595',

    businessName: 'Organisation',
    ABN: '1234 5678 95',
  },
  {
    id: '5940107005302237596',
    status: 'inactive',
    businessName: 'Organisation',
    ABN: '1234 5678 96',
  },
  {
    id: '5940107005302237597',
    status: 'inactive',
    businessName: 'Organisation',
    ABN: '1234 5678 97',
  },
  {
    id: '5940107005302237598',
    businessName: 'Organisation',
    ABN: '1234 5678 98',
  },
];

export const Schema = () => {
  const { schemaName } = useParams();

  const handleAddOrganisation = () => null;

  return (
    <BaseLayout title="Schema">
      <Box paddingBottom="40px">
        <Text variant="h4" fontWeight="bold" paddingBottom="24px">
          {schemaName}
        </Text>
        <Text>
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.
        </Text>

        <Text
          fontWeight="bold"
          variant="body1"
          paddingTop="24px"
          paddingBottom="8px"
        >
          Enable for all organisations?
        </Text>
        <Text>Description text</Text>
        <Stack direction="row" alignItems="center">
          <Checkbox />
          <Text>Enable this schema for all organisations</Text>
        </Stack>

        <Text variant="body1" fontWeight="bold" paddingTop="40px">
          Documents access
        </Text>
        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
      </Box>

      <DataTable
        handleAction={handleAddOrganisation}
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        toolBarActionLabel="Organisation"
      />
    </BaseLayout>
  );
};
