import { MainCard } from '@/common/components';
import { CashGraph } from './CashGraph';
import { Grid } from '@mui/material';
import WidgetCard from '@/common/components/WidgetCard';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const CashFlow = () => {
  const handles = {
    accountState: () => {
      console.log('Estado de cuenta');
    },
  };

  return (
    <>
      <Grid
        container
        sx={{
          pb: 2,
        }}
        spacing={2}
      >
        <Grid item xs={12} md={4}>
          <WidgetCard
            onClick={handles.accountState}
            top="Estado de Cuenta"
            center="Saldo"
            bottom="$ 1,000.00"
            bottom2={<RemoveRedEyeIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <WidgetCard
            onClick={handles.accountState}
            top="Gestion de Cajas"
            center="Cajas Actuales"
            bottom="3"
            bottom2={<RemoveRedEyeIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <WidgetCard
            onClick={handles.accountState}
            top="Autorizaciones Especiales"
            bottom="Nueva Autorizacion"
            bottom2={<RemoveRedEyeIcon />}
          />
        </Grid>
      </Grid>
      <MainCard>
        <div>
          <CashGraph
            header={'Revolvente'}
            chartSeries={[
              {
                name: 'This year',
                data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
              },
            ]}
            sx={{ height: '100%' }}
          />
        </div>
      </MainCard>
    </>
  );
};

export default CashFlow;
