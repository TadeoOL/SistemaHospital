import { MainCard, TablePaginated } from '@/common/components';
import { Button, Grid, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ExpenseModal from '../components/ExpenseModal';
import { getPaginacionMovimientos } from '../services/cashflow';
import IncomeAreaChart from '@/common/components/IncomeAreaChart';
import { useGetBoxMovements } from '../../charts/hooks/useGetBoxMovements';
import { convertDate } from '@/utils/convertDate';
import { removeTimeFromDate } from '../../utils/utils.common';

const CashFlowBoxById = () => {
  const location = useLocation();
  const id = location.pathname.split('/').pop();
  const navigation = useNavigate();
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date; weekly: boolean }>({
    start: new Date(new Date().getFullYear(), 0, 1),
    end: new Date(new Date().getFullYear() + 1, 0, 1),
    weekly: false,
  });
  const { query, invalidate } = useGetBoxMovements({
    fechaInicio: convertDate(removeTimeFromDate(dateRange.start)),
    fechaFin: convertDate(removeTimeFromDate(dateRange.end)),
    id_CajaRevolvente: id || '',
    esSemanal: dateRange.weekly,
  });
  const boxMovements = query.data;

  if (!id) {
    navigation('/tesoreria/revolvente/cajas');
    return null;
  }

  const [openNewExpenseModal, setOpenNewExpenseModal] = useState(false);

  const fetchMovementsByBox = async () => {
    try {
      const res = await getPaginacionMovimientos({
        id_CajaRevolvente: id,
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const handles = {
    openNewExpenseModal: () => {
      setOpenNewExpenseModal(true);
    },
    closeNewExpenseModal: () => {
      setOpenNewExpenseModal(false);
    },
  };

  const innerHeader = (
    <>
      <Grid container direction={'row'} justifyContent={'space-between'}>
        <Grid item>
          <Typography variant="h5">Estado de cuenta de la caja</Typography>
        </Grid>

        <Button variant="contained" onClick={handles.openNewExpenseModal}>
          Nuevo Gasto
        </Button>
      </Grid>
    </>
  );

  const columns = [
    {
      header: 'Folio',
      value: 'folio',
    },
    {
      header: 'Concepto',
      value: 'concepto',
    },
    {
      header: 'Cantidad',
      value: 'cantidad',
    },
    {
      header: 'Fecha Ingreso',
      value: 'fecha',
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
      <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
        {innerHeader}
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
              incomeMonthlyData={boxMovements?.entradas || []}
              expenseMonthlyData={boxMovements?.salidas || []}
              setDateRange={setDateRange}
              dateRange={dateRange}
              labels={boxMovements?.labels || []}
            />
          </Grid>
          {/* <Grid item xs={12} md={4}>
            <MonthlyBarChart data={[]} />
          </Grid> */}
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
        <TablePaginated columns={columns} fetchData={fetchMovementsByBox} params={{}} />
      </MainCard>
      <ExpenseModal
        open={openNewExpenseModal}
        onClose={handles.closeNewExpenseModal}
        id_CajaRevolvente={id}
        invalidate={invalidate}
      />
    </>
  );
};

export default CashFlowBoxById;
