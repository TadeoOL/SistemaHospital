import { Grid } from '@mui/material';
import WidgetCard from '@/common/components/WidgetCard';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ProductSales from '@/common/components/ProductSales';
import AcquisitionProducts from '../components/AcquisitionProducts';
import useAdministration from '../hooks/useAdministration';
import { AdministrationAuthorizationModal } from '../modals/AdministrationAuthorizationModal';
import { useAdministrationAuthorizationForm } from '../hooks/useAdministrationAuthorizationForm';

const TreasuryAdministration = () => {
  const { state, handlers } = useAdministration();
  console.log(state.fund);

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
        <Grid item xs={12} md={4}>
          <ProductSales />
        </Grid>
        <Grid item xs={12} md={8}>
          <AcquisitionProducts />
        </Grid>
      </Grid>
      <AdministrationAuthorizationModal
        open={state.openAuthorizationModal}
        onClose={handlers.closeAuthorizationModal}
        useAuthorizationForm={useAdministrationAuthorizationForm(handlers.createAuthorization)}
      />
    </>
  );
};

export default TreasuryAdministration;
