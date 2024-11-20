// material-ui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// project imports
import MainCard from './MainCard';
import React, { useMemo } from 'react';
import { SortComponent } from '../../components/Commons/SortComponent';
import { Box, Card, CircularProgress, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Column {
  header: string | React.ReactNode;
  value: string | Function | React.ReactNode;
  align?: 'left' | 'right' | 'center';
  sort?: Function;
}

const getHeader = (column: Column) => {
  if (!column?.header) return null;

  if (column.sort && typeof column.value === 'string') {
    const { header, value, sort } = column as any;
    return (
      <TableCell sx={{ position: 'sticky !important' }} align={column.align || 'left'}>
        <SortComponent tableCellLabel={header} headerName={value} setSortFunction={sort} />
      </TableCell>
    );
  }

  return (
    <TableCell sx={{ position: 'sticky !important' }} align={column.align || 'left'}>
      {column.header}
    </TableCell>
  );
};

const getCell = (column: Column, row: any) => {
  if (!column?.value) return null;

  if (typeof column.value === 'string') {
    return <TableCell align={column.align || 'left'}>{row[column.value]}</TableCell>;
  }

  if (typeof column.value === 'function') {
    return <TableCell align={column.align || 'left'}>{column.value(row)}</TableCell>;
  }

  return <TableCell align={column.align || 'left'}>{column.value}</TableCell>;
};

interface TableBasicProps {
  rows: any[];
  columns: Column[];
  isLoading?: boolean;
}
// ==============================|| MUI TABLE - BASIC ||============================== //

export default function TableBasic(props: TableBasicProps) {
  const { rows, columns, isLoading } = props;

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (rows.length === 0) {
    return (
      <Card
        sx={{
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
          columnGap: 1,
        }}
      >
        <ErrorOutlineIcon sx={{ color: 'neutral.400', width: '40px', height: '40px' }} />
        <Typography sx={{ color: 'neutral.400' }} fontSize={24} fontWeight={500}>
          No existen registros
        </Typography>
      </Card>
    );
  }

  const tableMaxHeight = useMemo(() => {
    return window.innerHeight - 390;
  }, []);

  return (
    <MainCard content={false}>
      <TableContainer sx={{ maxHeight: tableMaxHeight }}>
        <Table stickyHeader sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>{columns.map((column) => getHeader(column))}</TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow hover key={row.name}>
                {columns.map((column) => getCell(column, row))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}
