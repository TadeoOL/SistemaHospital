import { Grid } from '@mui/material';
import { CashGraph } from '../../components/CashGraph';
import WidgetCard from '@/common/components/WidgetCard';
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useState } from 'react';
import FixedFundModal from '../components/FixedFundModal';
import ProductSales from '@/common/components/ProductSales';

const TreasuryAdministration = () => {
  const navigation = useNavigate();

  const [openFixedFundModal, setOpenFixedFundModal] = useState(false);

  const handles = {
    closeFixedFundModal: () => {
      setOpenFixedFundModal(false);
    },
    openFixedFundModal: () => {
      setOpenFixedFundModal(true);
    },
    navigateToDeposits: () => {
      navigation('/tesoreria/direccion/depositos');
    },
    navigateToMovements: () => {
      navigation('/tesoreria/direccion/movimientos');
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
            onClick={handles.navigateToDeposits}
            top="Estado de Cuenta"
            center="Saldo"
            bottom="$ 1,000.00"
            bottom2={<RemoveRedEyeIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <WidgetCard
            onClick={handles.openFixedFundModal}
            top="Fondo fijo"
            bottom="Asignar fondo fijo"
            bottom2={<RemoveRedEyeIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <WidgetCard
            onClick={handles.navigateToMovements}
            top="Consulta de movimientos"
            bottom2={<RemoveRedEyeIcon />}
          />
        </Grid>
      </Grid>
      <Grid container direction={'row'}>
        <Grid item xs={12} md={4}>
          <ProductSales />
        </Grid>
      </Grid>
      <CashGraph
        header={'Direccion'}
        chartSeries={[
          {
            name: 'This year',
            data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
          },
        ]}
        sx={{ height: '100%' }}
      />
      <FixedFundModal open={openFixedFundModal} onClose={handles.closeFixedFundModal} />
    </>
  );
};

export default TreasuryAdministration;
