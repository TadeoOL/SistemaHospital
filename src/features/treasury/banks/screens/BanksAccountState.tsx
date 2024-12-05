import { Grid, Typography } from '@mui/material';
import { CashGraph } from '../../components/CashGraph';
import { useState } from 'react';
import { MainCard, TablePaginated } from '@/common/components';
import { getEmptyResponse } from '../../helpers/getEmptyResponse';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

const BanksAccountState = () => {
  const [value, setValue] = useState<any>(dayjs(new Date('2014-08-18T21:11:54')));

  const handleChange = (newValue: any) => {
    console.log('newValue:', newValue);
    setValue(newValue);
  };

  const innerHeader = (
    <>
      <Grid container direction={'row'} justifyContent={'space-between'}>
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
      <CashGraph
        innerHeader={innerHeader}
        chartSeries={[
          {
            name: 'This year',
            data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
          },
          {
            name: 'Last year',
            data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
          },
        ]}
        sx={{ height: '100%' }}
      />

      <MainCard sx={{ mt: 2 }}>
        <Typography
          sx={{
            pb: 1,
          }}
          variant="subtitle1"
        >
          Ultimos Movimientos
        </Typography>
        <TablePaginated columns={columns} fetchData={getEmptyResponse} params={{}} />
      </MainCard>
    </>
  );
};

export default BanksAccountState;
