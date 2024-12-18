import { Grid } from '@mui/material';
import WidgetCard from '@/common/components/WidgetCard';
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useState } from 'react';
import FixedFundModal from '../components/FixedFundModal';
import ProductSales from '@/common/components/ProductSales';
import AcquisitionProducts from '../components/AcquisitionProducts';

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
      <Grid container direction={'row'} spacing={2}>
        <Grid item xs={12} md={4}>
          <ProductSales />
        </Grid>
        <Grid item xs={12} md={8}>
          <AcquisitionProducts />
        </Grid>
      </Grid>
      <FixedFundModal open={openFixedFundModal} onClose={handles.closeFixedFundModal} />
    </>
  );
};

export default TreasuryAdministration;
