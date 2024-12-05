import { MainCard, TablePaginated } from '@/common/components';
import { getEmptyResponse } from '../../helpers/getEmptyResponse';
import { Button, Grid, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CashGraph } from '../../components/CashGraph';
import ExpenseModal from '../components/ExpenseModal';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

const CashFlowBoxById = () => {
  const location = useLocation();
  const id = location.pathname.split('/').pop();

  const loadDataById = async () => {
    console.log('id:', id);
  };

  useEffect(() => {
    loadDataById();
  }, []);
  const [openNewExpenseModal, setOpenNewExpenseModal] = useState(false);

  const fakeData = {
    nombre: '1',
  };

  const handles = {
    openNewExpenseModal: () => {
      setOpenNewExpenseModal(true);
    },
    closeNewExpenseModal: () => {
      setOpenNewExpenseModal(false);
    },
  };

  const [value, setValue] = useState<any>(dayjs(new Date('2014-08-18T21:11:54')));

  const handleChange = (newValue: any) => {
    console.log('newValue:', newValue);
    setValue(newValue);
  };

  const innerHeader = (
    <>
      <Grid container direction={'row'} justifyContent={'space-between'}>
        <Grid item>
          <Typography variant="h5">Estado de cuenta de la caja</Typography>
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

  return (
    <>
      <Typography variant="h3" sx={{ pt: 3, pb: 2 }}></Typography>
      <CashGraph
        innerHeader={innerHeader}
        header={`Caja (${fakeData.nombre})`}
        chartSeries={[
          {
            name: 'This year',
            data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
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
      <ExpenseModal open={openNewExpenseModal} onClose={handles.closeNewExpenseModal} />
    </>
  );
};

export default CashFlowBoxById;
