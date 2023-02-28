import { DataTable, MoreInfo, Text } from '@dvp/vc-ui';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
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
    field: 'document',
    headerName: 'Document',
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
        items={{ View: () => null, Download: () => null, Revoke: () => null }}
      />
    ),
    disableColumnMenu: true,
    sortable: false,
  },
];

const rows = [
  {
    id: '5940107005302237590',
    document: 'AANZFTA',
    businessName: 'Organisation',
    ABN: '1234 5678 90',
    dateIssued: '01/01/2012',
  },
  {
    id: '5940107005302237591',
    document: 'CITES',
    businessName: 'Organisation',
    ABN: '1234 5678 91',
    dateIssued: '01/01/2012',
  },
  {
    id: '5940107005302237592',
    document: 'AANZFTA',
    businessName: 'Organisation',
    ABN: '1234 5678 92',
    dateIssued: '01/01/2018',
  },
  {
    id: '5940107005302237593',
    document: 'CITES',
    businessName: 'Organisation',
    ABN: '1234 5678 93',
    dateIssued: '01/01/2018',
  },
  {
    id: '5940107005302237594',
    document: 'CITES',
    businessName: 'Organisation',
    ABN: '1234 5678 94',
    dateIssued: '01/01/2032',
  },
  {
    id: '5940107005302237595',
    document: 'AANZFTA',
    businessName: 'Organisation',
    ABN: '1234 5678 95',
    dateIssued: '01/01/2019',
  },
  {
    id: '5940107005302237596',
    document: 'CITES',
    businessName: 'Organisation',
    ABN: '1234 5678 96',
    dateIssued: '01/01/2019',
  },
  {
    id: '5940107005302237597',
    document: 'CITES',
    businessName: 'Organisation',
    ABN: '1234 5678 97',
    dateIssued: '01/01/2020',
  },
  {
    id: '5940107005302237598',
    document: 'AANZFTA',
    businessName: 'Organisation',
    ABN: '1234 5678 98',
    dateIssued: '01/01/2022',
  },
];

export const Documents = () => {
  const navigate = useNavigate();

  const handleIssue = () => {
    navigate('/issue');
  };

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
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </BaseLayout>
  );
};
