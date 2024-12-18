import { MainCard, TablePaginated } from '@/common/components';
import { Typography } from '@mui/material';
import { useRef } from 'react';
import { IAdministrationMovementHistory } from '../types/types.administration';
import { TablePaginatedColumn } from '@/types/tableComponentTypes';
import { getAdministrationMovementsPagination } from '../services/services.administration';

const TreasuryAdministrationMovements = () => {
  const tableRef = useRef<IAdministrationMovementHistory>(null);

  const columns: TablePaginatedColumn<IAdministrationMovementHistory>[] = [
    {
      header: 'Folio',
      value: 'folio',
    },
    {
      header: 'Concepto',
      value: (row: IAdministrationMovementHistory) => {
        return row.concepto ? row.concepto : 'N/A';
      },
    },
    {
      header: 'Tipo de Pago',
      value: 'tipoPago',
    },
    {
      header: 'Cantidad',
      value: 'cantidad',
    },
    {
      header: 'Fecha Ingreso',
      value: 'fecha',
    },
    {
      header: 'Notas',
      value: 'notas',
    },
  ];

  return (
    <MainCard sx={{ mt: 2 }}>
      <Typography
        sx={{
          pb: 1,
        }}
        variant="subtitle1"
      >
        Consulta de Movimientos
      </Typography>
      <TablePaginated ref={tableRef} columns={columns} fetchData={getAdministrationMovementsPagination} params={{}} />
    </MainCard>
  );
};

export default TreasuryAdministrationMovements;
