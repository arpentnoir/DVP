import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
  },
  {
    field: 'firstName',
    headerName: 'First Name',
  },
  {
    field: 'lastName',
    headerName: 'Last Name',
  },
];

export const rows = [
  {
    id: '006',
    firstName: 'Postman',
    lastName: 'Pat',
  },
  {
    id: '007',
    firstName: 'Wreck-It',
    lastName: 'Ralph',
  },
];
