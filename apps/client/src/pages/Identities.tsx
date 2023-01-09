import { Button, Card, DataTable, MoreInfo, Text } from '@dvp/vc-ui';
import AddIcon from '@mui/icons-material/Add';
import { Box, Stack } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { BaseLayout } from '../layouts';

// TODO: Replace with real data
const columns: GridColDef[] = [
  {
    field: 'nickname',
    headerName: 'Nickname',
    minWidth: 200,
    flex: 1,
    disableColumnMenu: true,
  },
  {
    field: 'id',
    headerName: 'Public key',
    minWidth: 150,
    flex: 1,
    disableColumnMenu: true,
  },
  {
    field: 'dateIssued',
    headerName: 'Date Issued',
    sortable: false,
    minWidth: 150,
    flex: 1,
    disableColumnMenu: true,
  },
  {
    field: 'moreInfo',
    headerName: '',
    flex: 1,
    renderCell: (params) => (
      <MoreInfo
        params={params}
        items={{ Remove: () => null, Revoke: () => null }}
      />
    ),
    disableColumnMenu: true,
    sortable: false,
  },
];

const rows = [
  {
    id: '5940107005302237590',
    nickname: 'ABC Internal',
    dateIssued: '01/01/2012',
  },
  {
    id: '5940107005302237591',
    nickname: 'ABC External',
    dateIssued: '01/01/2012',
  },
  {
    id: '5940107005302237592',
    nickname: 'XYZ Private',
    dateIssued: '01/01/2018',
  },
  {
    id: '5940107005302237593',
    nickname: 'XYZ Public',
    dateIssued: '01/01/2018',
  },
];

const identities = [
  {
    name: 'Identity 1',
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    handleAction: () => null,
  },
  {
    name: 'Identity 2',
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    handleAction: () => null,
  },
  {
    name: 'Identity 3',
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    handleAction: () => null,
  },
];

export const Identities = () => {
  const handleCreateNew = () => null;

  return (
    <BaseLayout title="Identities">
      <Box paddingBottom="40px">
        <Text variant="h4" fontWeight="bold" paddingBottom="24px">
          Identities
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

      <Box paddingBottom="40px">
        <Text variant="body1" fontWeight="bold">
          Identifiers (DIDs)
        </Text>
        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing="8px"
          paddingY="40px"
        >
          {identities.map((identity) => (
            <Card
              key={identity.name}
              name={identity.name}
              text={identity.text}
              handleAction={identity.handleAction}
              actionLabel="Remove"
            />
          ))}
        </Stack>
        <Stack direction="row" spacing="16px">
          <Button label="Upload DID" variant="outlined" />
          <Button label="Create new" leftIcon={<AddIcon />} color="error" />
        </Stack>
      </Box>

      <Box paddingBottom="30px">
        <Text variant="body1" fontWeight="bold">
          Key pairs
        </Text>
        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
      </Box>

      <DataTable
        handleAction={handleCreateNew}
        toolBarActionLabel="Create new"
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </BaseLayout>
  );
};
