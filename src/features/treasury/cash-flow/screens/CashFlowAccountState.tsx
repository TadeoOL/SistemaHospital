import { Grid, Typography } from '@mui/material';
import { useState } from 'react';
import AuthorizationModal from '../components/AuthorizationModal';
import { Button } from '@mui/material';
import { MainCard, TablePaginated } from '@/common/components';
import IncomeAreaChart from '@/common/components/IncomeAreaChart';
import { getPaginacionSalidasMonetarias } from '../services/cashflow';
import { useGetGeneralMovements } from '../../charts/hooks/useGetGeneralMovements';
import { convertDate } from '@/utils/convertDate';
import { removeTimeFromDate } from '../../utils/utils.common';
import { MovementArea } from '../../types/types.common';

const CashFlowAccountState = () => {
  const [openAuthorizationModal, setOpenAuthorizationModal] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date; weekly: boolean }>({
    start: new Date(new Date().getFullYear(), 0, 1),
    end: new Date(new Date().getFullYear() + 1, 0, 1),
    weekly: false,
  });
  const params = {
    fechaInicio: convertDate(removeTimeFromDate(dateRange.start)),
    fechaFin: convertDate(removeTimeFromDate(dateRange.end)),
    id_Origen: MovementArea.REVOLVENTE,
    id_Destino: MovementArea.REVOLVENTE,
    esSemanal: dateRange.weekly,
  };
  const { data: generalMovements } = useGetGeneralMovements(params);

  const handles = {
    closeAuthorizationModal: () => {
      setOpenAuthorizationModal(false);
    },
    openAuthorizationModal: () => {
      setOpenAuthorizationModal(true);
    },
  };

  const innerHeader = (
    <>
      <Grid container direction={'row'} sx={{ p: 3 }} justifyContent={'space-between'}>
        <Grid item>
          <Typography variant="h5">Estado de cuenta</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handles.openAuthorizationModal}>
            Nueva Autorizacion
          </Button>
        </Grid>
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
      value: 'Concepto',
    },
    {
      header: 'Cantidad',
      value: 'Cantidad',
    },
    {
      header: 'Fecha Ingreso',
      value: 'Fecha',
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
              incomeMonthlyData={generalMovements?.entradas || []}
              expenseMonthlyData={generalMovements?.salidas || []}
              setDateRange={setDateRange}
              dateRange={dateRange}
              labels={generalMovements?.labels || []}
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
        <TablePaginated columns={columns} fetchData={getPaginacionSalidasMonetarias} params={{}} />
      </MainCard>

      <AuthorizationModal open={openAuthorizationModal} onClose={handles.closeAuthorizationModal} />
    </>
  );
};

export default CashFlowAccountState;
