import { Grid, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { MainCard, TablePaginated } from '@/common/components';
import IncomeAreaChart from '@/common/components/IncomeAreaChart';
import { IBank } from '../types/types.bank';
import { TablePaginatedColumn } from '@/types/tableComponentTypes';
import { BankService } from '../services/services.bank';
import { useGetBankMovements } from '../../charts/hooks/useGetBankMovements';
import { convertDate } from '@/utils/convertDate';
import { MovementArea } from '../../types/types.common';
import { removeTimeFromDate } from '../../utils/utils.common';

const BanksAccountState = () => {
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date; weekly: boolean }>({
    start: new Date(new Date().getFullYear(), 0, 1),
    end: new Date(new Date().getFullYear() + 1, 0, 1),
    weekly: false,
  });
  const tableRef = useRef<IBank>(null);

  const params = {
    fechaInicio: convertDate(removeTimeFromDate(dateRange.start)),
    fechaFin: convertDate(removeTimeFromDate(dateRange.end)),
    id_Origen: MovementArea.BANCO,
    id_Destino: MovementArea.BANCO,
    esSemanal: dateRange.weekly,
  };
  const { data: bankMovements } = useGetBankMovements(params);

  const columns: TablePaginatedColumn<IBank>[] = [
    {
      header: 'Folio',
      value: 'folio',
    },
    {
      header: 'Concepto',
      value: (row: IBank) => {
        return row.concepto ? row.concepto : 'N/A';
      },
    },
    {
      header: 'Cantidad',
      value: 'cantidad',
    },
    {
      header: 'Fecha Ingreso',
      value: 'fechaIngreso',
    },
  ];

  const title = dateRange.weekly
    ? `${dateRange.start.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })} - ${dateRange.end.toLocaleDateString(
        'es-ES',
        {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }
      )}`
    : `${dateRange.start.getFullYear()} - ${dateRange.end.getFullYear()}`;

  return (
    <>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Grid
          container
          sx={{
            pb: 2,
          }}
          spacing={2}
        >
          <Grid item xs={12}>
            <IncomeAreaChart
              view={dateRange.weekly ? 'weekly' : 'monthly'}
              title={title}
              incomeMonthlyData={bankMovements?.entradas ?? []}
              expenseMonthlyData={bankMovements?.salidas ?? []}
              setDateRange={setDateRange}
              dateRange={dateRange}
              labels={bankMovements?.labels ?? []}
            />
          </Grid>
        </Grid>
      </MainCard>

      <MainCard sx={{ mt: 2 }}>
        <Typography
          sx={{
            pb: 1,
          }}
          variant="subtitle1"
        >
          Ultimos Movimientos
        </Typography>
        <TablePaginated ref={tableRef} columns={columns} fetchData={BankService.getBankPagination} params={{}} />
      </MainCard>
    </>
  );
};

export default BanksAccountState;
