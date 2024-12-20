import { MainCard, TablePaginated } from '@/common/components';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { AdministrationService } from '../services/services.administration';
import { useRef } from 'react';
import { IAdministrationMovement } from '../types/types.administration';
import { CheckCircle } from '@mui/icons-material';
import { TablePaginatedColumn } from '@/types/tableComponentTypes';
import useAdministrationDeposits from '../hooks/useAdministrationDeposits';

const TreasuryAdministrationDeposits = () => {
  const tableRef = useRef<any>();
  const { handlers, state } = useAdministrationDeposits();

  const columns: TablePaginatedColumn<IAdministrationMovement>[] = [
    {
      header: 'Folio',
      value: 'folio',
    },
    {
      header: 'Concepto',
      value: (row: IAdministrationMovement) => {
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
      value: 'fechaIngreso',
    },
    {
      header: 'Acciones',
      value: (row: IAdministrationMovement) => {
        return (
          <>
            <Tooltip title="Aprobar">
              <IconButton onClick={() => handlers.approveDeposit(row.id_VentaCaja)}>
                <CheckCircle color="success" />
              </IconButton>
            </Tooltip>
          </>
        );
      },
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
        Depositos Pendientes
      </Typography>
      <TablePaginated
        ref={tableRef}
        columns={columns}
        fetchData={AdministrationService.getDepositsPendingPagination}
        params={{
          aproved: state.refreshTable,
        }}
      />
    </MainCard>
  );
};

export default TreasuryAdministrationDeposits;
