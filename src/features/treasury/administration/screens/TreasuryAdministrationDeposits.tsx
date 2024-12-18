import { MainCard, TablePaginated } from '@/common/components';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { getDepositsPendingPagination } from '../services/services.administration';
import { useRef } from 'react';
import { IAdministrationMovement } from '../types/types.administration';
import { CheckCircle } from '@mui/icons-material';
import { TablePaginatedColumn } from '@/types/tableComponentTypes';
import { administrationAlerts } from '../utils/utils.alerts.administration';
import { useCreateDeposit } from '../hooks/useCreateDeposit';

const TreasuryAdministrationDeposits = () => {
  const tableRef = useRef<any>();
  const { mutate: createDeposit } = useCreateDeposit();

  const handleApprove = async (id: string) => {
    const res = await administrationAlerts.createDepositQuestion();
    if (res.isConfirmed) {
      createDeposit(id, {
        onSuccess: async () => {
          await administrationAlerts.depositApproved();
          tableRef.current.refresh();
        },
        onError: async () => {
          await administrationAlerts.depositError();
        },
      });
    }
  };

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
              <IconButton onClick={() => handleApprove(row.id_VentaCaja)}>
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
        fetchData={getDepositsPendingPagination}
        params={{
          aproved: true,
        }}
      />
    </MainCard>
  );
};

export default TreasuryAdministrationDeposits;
