import { Grid, Typography } from '@mui/material';
import { useState } from 'react';
import AuthorizationModal from '../components/AuthorizationModal';
import { Button } from '@mui/material';
import { MainCard, TablePaginated } from '@/common/components';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import IncomeAreaChart from '@/common/components/IncomeAreaChart';
import MonthlyBarChart from '@/common/components/MonthlyBarChart';
import { getPaginacionSalidasMonetarias } from '../services/cashflow';

const CashFlowAccountState = () => {
  const [openAuthorizationModal, setOpenAuthorizationModal] = useState(false);

  const handles = {
    closeAuthorizationModal: () => {
      setOpenAuthorizationModal(false);
    },
    openAuthorizationModal: () => {
      setOpenAuthorizationModal(true);
    },
  };

  const [value, setValue] = useState<any>(dayjs(new Date('2014-08-18T21:11:54')));

  const handleChange = (newValue: any) => {
    console.log('newValue:', newValue);
    setValue(newValue);
  };

  const innerHeader = (
    <>
      <Grid container direction={'row'} sx={{ p: 3 }} justifyContent={'space-between'}>
        <Grid item>
          <Typography variant="h5">Estado de cuenta</Typography>
        </Grid>
        <Grid item>
          <Grid container direction={'row'} spacing={2}>
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker format="MM/dd/yyyy" value={value} onChange={handleChange} />
              </LocalizationProvider>
            </Grid>
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker format="MM/dd/yyyy" value={value} onChange={handleChange} />
              </LocalizationProvider>
            </Grid>
          </Grid>
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
          <Grid item xs={12} md={8}>
            {/* <IncomeAreaChart view="monthly" /> */}
          </Grid>
          <Grid item xs={12} md={4}>
            <MonthlyBarChart />
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
        <TablePaginated columns={columns} fetchData={getPaginacionSalidasMonetarias} params={{}} />
      </MainCard>

      <AuthorizationModal open={openAuthorizationModal} onClose={handles.closeAuthorizationModal} />
    </>
  );
};

export default CashFlowAccountState;
