import { TableCell, styled } from '@mui/material';

export const TableHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  fontWeight: 600,
  whiteSpace: 'nowrap',
  padding: '16px',
}));
