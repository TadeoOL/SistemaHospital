import { Grid } from '@mui/material';
import WidgetCard from '@/common/components/WidgetCard';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ProductSales from '@/common/components/ProductSales';
import useAdministration from '../hooks/useAdministration';
import { AdministrationAuthorizationModal } from '../modals/AdministrationAuthorizationModal';
import { useAdministrationAuthorizationForm } from '../hooks/useAdministrationAuthorizationForm';
import MonthlyBarChart from '@/common/components/MonthlyBarChart';
import { MainCard } from '@/common/components';

const TreasuryAdministration = () => {
  const { state, handlers } = useAdministration();

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
            onClick={handlers.navigateToDeposits}
            top="Estado de Cuenta"
            center="Saldo"
            bottom={`$ ${state.fund.saldo.toFixed(2)}`}
            bottom2={<RemoveRedEyeIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <WidgetCard
            onClick={handlers.openAuthorizationModal}
            top="Autorizaciones especiales"
            bottom="Nueva autorización"
            bottom2={<RemoveRedEyeIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <WidgetCard
            onClick={handlers.navigateToMovements}
            top="Consulta de movimientos"
            bottom2={<RemoveRedEyeIcon />}
          />
        </Grid>
      </Grid>
      <Grid container direction={'row'} spacing={2}>
        <Grid item xs={12} md={8}>
          <ProductSales sellsAndMovements={state.sellsAndMovements} />
        </Grid>
        <Grid item xs={12} md={4}>
          <MainCard content={false} title="Resumen de entradas semanal" sx={{ height: '100%' }}>
            <MonthlyBarChart data={state.sellsAndMovements.ingresosPorSemana} />
          </MainCard>
        </Grid>
      </Grid>
      <AdministrationAuthorizationModal
        open={state.openAuthorizationModal}
        onClose={handlers.closeAuthorizationModal}
        useAuthorizationForm={useAdministrationAuthorizationForm(handlers.createAuthorization, state.fund.saldo)}
        fund={state.fund.saldo}
      />
    </>
  );
};

export default TreasuryAdministration;
